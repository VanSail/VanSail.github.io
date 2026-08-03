import {useEffect, useRef, useState, type ReactNode, useCallback} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './serial-monitor.module.css';

type LogDir = 'in' | 'out';

interface LogEntry {
  id: number;
  text: string;
  dir: LogDir;
  time: string;
}

interface SerialPortLike {
  open(opts: {
    baudRate: number;
    dataBits?: number;
    stopBits?: number;
    parity?: string;
    flowControl?: string;
  }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
  getInfo(): {usbVendorId?: number; usbProductId?: number};
}

declare global {
  interface Navigator {
    serial?: {
      requestPort(opts?: {
        filters?: Array<{usbVendorId?: number; usbProductId?: number}>;
      }): Promise<SerialPortLike>;
      getPorts(): Promise<SerialPortLike[]>;
    };
  }
}

const BAUD_RATES = [
  1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600,
];
const MAX_LOGS = 2000;
const RING_BUFFER_BATCH_MS = 50; // 接收节流：每 ~50ms 合并刷一次 UI
const MAX_DECODE_BYTES_PER_CHUNK = 64 * 1024;

// 将 Uint8Array 字节数组编码成 HEX 字符串（空格分隔，便于阅读）
const bytesToHex = (bytes: Uint8Array): string => {
  const out: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    out.push(bytes[i].toString(16).padStart(2, '0').toUpperCase());
  }
  return out.join(' ');
};

// 解析 HEX 文本（空格分隔）成 Uint8Array，失败返回 null
const parseHexInput = (text: string): Uint8Array | null => {
  const parts = text
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  if (parts.length === 0) return null;
  const bytes = new Uint8Array(parts.length);
  for (let i = 0; i < parts.length; i++) {
    const n = parseInt(parts[i], 16);
    if (Number.isNaN(n) || n < 0 || n > 255) return null;
    bytes[i] = n;
  }
  return bytes;
};

type Locale = 'zh' | 'en';

// 将浏览器原生（多为英文）报错转换为对应语言的提示
const toError = (e: unknown, locale: Locale): string => {
  const msg = e instanceof Error ? e.message : String(e);
  const zh: Array<[RegExp, string]> = [
    [/abort/i, '已取消操作（未选择串口）'],
    [/open/i, '打开串口失败：设备可能被占用或已断开'],
    [/write|flush|send/i, '发送失败：串口可能已断开'],
    [/read/i, '读取失败：串口可能已断开'],
    [
      /network|frame|parity|overrun/i,
      `串口通信异常：${msg}（请检查波特率/接线）`,
    ],
    [/.*/, `操作失败：${msg}`],
  ];
  const en: Array<[RegExp, string]> = [
    [/abort/i, 'Operation cancelled (no port selected)'],
    [/open/i, 'Failed to open port: device may be busy or disconnected'],
    [/write|flush|send/i, 'Send failed: port may be disconnected'],
    [/read/i, 'Read failed: port may be disconnected'],
    [
      /network|frame|parity|overrun/i,
      `Serial communication error: ${msg} (check baud rate / wiring)`,
    ],
    [/.*/, `Operation failed: ${msg}`],
  ];
  const map = locale === 'en' ? en : zh;
  for (const [re, text] of map) {
    if (re.test(msg)) return text;
  }
  return `Operation failed: ${msg}`;
};

const T = {
  title: {zh: '串口监视器', en: 'Serial Monitor'},
  desc: {
    zh: '通过浏览器进行串口数据的发送与接收',
    en: 'Send and receive serial data right in the browser',
  },
  subtitle: {
    zh: '通过浏览器 Web Serial API 与串口设备通信（需使用 Chrome / Edge 等 Chromium 内核浏览器，并通过 HTTPS 访问）',
    en: 'Communicate with serial devices via the Web Serial API (requires a Chromium-based browser such as Chrome / Edge, accessed over HTTPS)',
  },
  unsupported: {
    zh: '当前浏览器不支持 Web Serial API。请使用最新版 Chrome、Edge 或 Opera 打开本页面，并确保通过 HTTPS 访问。',
    en: 'Your browser does not support the Web Serial API. Please open this page with the latest Chrome, Edge or Opera and ensure it is accessed over HTTPS.',
  },
  baud: {zh: '波特率', en: 'Baud Rate'},
  disconnect: {zh: '断开连接', en: 'Disconnect'},
  connect: {zh: '连接串口', en: 'Connect Port'},
  resume: {zh: '继续显示', en: 'Resume'},
  pause: {zh: '暂停显示', en: 'Pause'},
  clear: {zh: '清空', en: 'Clear'},
  connected: {zh: '已连接', en: 'Connected'},
  disconnected: {zh: '未连接', en: 'Disconnected'},
  waiting: {zh: '等待数据…', en: 'Waiting for data…'},
  pausedBadge: {zh: '已暂停，新数据不展示', en: 'Paused — new data is hidden'},
  placeholderHex: {
    zh: '十六进制，如：48 49 0A',
    en: 'HEX bytes, e.g. 48 49 0A',
  },
  placeholderText: {zh: '输入要发送的内容', en: 'Type something to send'},
  send: {zh: '发送', en: 'Send'},
  hexSend: {zh: 'HEX 发送', en: 'HEX Send'},
  hexReceive: {zh: 'HEX 接收', en: 'HEX Receive'},
  appendCrlf: {zh: '发送时自动追加 CRLF', en: 'Append CRLF on send'},
  autoSend: {zh: '定时发送（自动循环）', en: 'Auto Send (timer loop)'},
  sendContent: {zh: '发送内容', en: 'Content'},
  placeholderAutoHex: {
    zh: 'HEX 字节，如 01 03 00 00',
    en: 'HEX bytes, e.g. 01 03 00 00',
  },
  placeholderAutoText: {zh: '要循环发送的文本', en: 'Text to send repeatedly'},
  interval: {zh: '间隔 (ms)', en: 'Interval (ms)'},
  sendAsHex: {zh: '以 HEX 形式发送', en: 'Send as HEX'},
  stopAuto: {zh: '停止定时发送', en: 'Stop Auto Send'},
  startAuto: {zh: '启动定时发送', en: 'Start Auto Send'},
  connectedMsg: {zh: '已连接，波特率 ', en: 'Connected, baud rate '},
  disconnectedMsg: {zh: '已断开连接', en: 'Disconnected'},
  hexFormatError: {
    zh: '十六进制格式错误（应为 00-FF 的空格分隔字节）',
    en: 'Invalid HEX format (space-separated bytes from 00 to FF)',
  },
  autoEmpty: {
    zh: '自动发送内容为空，已暂停',
    en: 'Auto-send content is empty, paused',
  },
} as const;

export default function SerialMonitor(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: Locale = currentLocale === 'en' ? 'en' : 'zh';
  const [supported, setSupported] = useState(true);
  const [connected, setConnected] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState('');
  const [hexMode, setHexMode] = useState(false);
  const [hexReceive, setHexReceive] = useState(false);
  const [addNewline, setAddNewline] = useState(true);
  const [paused, setPaused] = useState(false);
  const [autoSendText, setAutoSendText] = useState('');
  const [autoSendInterval, setAutoSendInterval] = useState(1000);
  const [autoSendHex, setAutoSendHex] = useState(false);
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({tx: 0, rx: 0});

  const portRef = useRef<SerialPortLike | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(
    null,
  );
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null,
  );
  const logRef = useRef<HTMLDivElement>(null);
  const logIdCounterRef = useRef(0);

  // 接收缓冲：read loop 推入后由 RAF 统一刷给 React
  const receivedBufferRef = useRef<Uint8Array[]>([]);
  const flushTimerRef = useRef<number | null>(null);
  const readerLoopRunningRef = useRef(false);
  const autoSendTimerRef = useRef<number | null>(null);
  const autoSendCancelledRef = useRef(false);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serial' in navigator)) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (logRef.current && !paused) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, paused]);

  // 组件卸载时确保关闭端口
  useEffect(() => {
    return () => {
      autoSendCancelledRef.current = true;
      if (autoSendTimerRef.current !== null) {
        clearInterval(autoSendTimerRef.current);
      }
      void (async () => {
        try {
          await readerRef.current?.cancel();
        } catch {
          /* noop */
        }
        try {
          await writerRef.current?.close();
        } catch {
          /* noop */
        }
        try {
          await portRef.current?.close();
        } catch {
          /* noop */
        }
      })();
    };
  }, []);

  // 接收数据 -> 解码 -> 入缓冲。缓冲由 flushLogs 负责刷给 React
  const pushReceived = useCallback((chunk: Uint8Array) => {
    if (chunk.length === 0) return;
    receivedBufferRef.current.push(chunk);
    setStats(s => ({...s, rx: s.rx + chunk.length}));

    if (flushTimerRef.current !== null) return;
    flushTimerRef.current = window.setTimeout(
      () => flushLogsRef.current(),
      RING_BUFFER_BATCH_MS,
    );
  }, []);

  const flushLogs = useCallback(() => {
    flushTimerRef.current = null;
    const chunks = receivedBufferRef.current;
    if (chunks.length === 0) return;
    receivedBufferRef.current = [];

    // 计算总字节数（防止单 chunk 极大时分配过大字符串）
    const total = chunks.reduce((n, c) => n + c.length, 0);
    if (total === 0) return;

    let payload: string;
    if (hexReceive) {
      // HEX 模式：直接把全部字节转成 hex
      const merged =
        total <= MAX_DECODE_BYTES_PER_CHUNK
          ? mergeChunks(chunks, total)
          : truncateChunks(chunks);
      payload = bytesToHex(merged);
    } else {
      // 文本模式：用 TextDecoder 解码
      const merged =
        total <= MAX_DECODE_BYTES_PER_CHUNK
          ? mergeChunks(chunks, total)
          : truncateChunks(chunks);
      try {
        payload = new TextDecoder('utf-8', {fatal: false}).decode(merged);
      } catch {
        payload = bytesToHex(merged);
      }
    }

    appendLog(payload, 'in');
  }, [hexReceive]);

  // 用 ref 持有最新的 flushLogs，避免 pushReceived 闭包捕获到过期版本
  const flushLogsRef = useRef(flushLogs);
  useEffect(() => {
    flushLogsRef.current = flushLogs;
  }, [flushLogs]);

  function mergeChunks(chunks: Uint8Array[], total: number): Uint8Array {
    const merged = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) {
      merged.set(c, off);
      off += c.length;
    }
    return merged;
  }

  function truncateChunks(chunks: Uint8Array[]): Uint8Array {
    // 单批超限：只保留最后 take 字节，且保持原始到达顺序（用于 HEX/文本可读性）
    const take = MAX_DECODE_BYTES_PER_CHUNK;
    const acc = new Uint8Array(take);
    let head = 0;
    let remaining = take;
    // 正向遍历（先到的在前），只截取靠近末尾的部分
    for (let i = 0; i < chunks.length && remaining > 0; i++) {
      const c = chunks[i];
      // 若整体会超限，则跳过 chunk 的前面部分，仅保留可能落入窗口的尾部
      const skip = Math.max(0, c.length - remaining);
      const slice = c.subarray(skip);
      acc.set(slice, head);
      head += slice.length;
      remaining -= slice.length;
    }
    return acc.subarray(0, head);
  }

  const appendLog = (text: string, dir: LogDir) => {
    if (!text) return;
    const time = new Date().toLocaleTimeString(
      locale === 'en' ? 'en-GB' : 'zh-CN',
      {hour12: false},
    );
    // 单调递增 id（避免 Date.now() 同毫秒冲突，也避免丢字符导致视觉抖动）
    logIdCounterRef.current += 1;
    const id = logIdCounterRef.current;
    setLogs(prev => [...prev, {id, text, dir, time}].slice(-MAX_LOGS));
  };

  const disconnect = async () => {
    // 1. 先停自动发送
    if (autoSendTimerRef.current !== null) {
      clearInterval(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
    setAutoSendEnabled(false);

    // 2. 先 cancel reader，让 reader loop 退出
    try {
      await readerRef.current?.cancel();
    } catch {
      /* noop */
    }
    readerRef.current = null;
    readerLoopRunningRef.current = false;

    // 3. 再关 writer
    try {
      await writerRef.current?.close();
    } catch {
      /* noop */
    }
    writerRef.current = null;

    // 4. 最后关端口
    try {
      await portRef.current?.close();
    } catch {
      /* noop */
    }
    portRef.current = null;

    // 5. 推出最后一批接收数据
    if (flushTimerRef.current !== null) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    flushLogs();

    setConnected(false);
    appendLog(T.disconnectedMsg[locale], 'out');
  };

  const connect = async () => {
    setError('');
    try {
      if (!navigator.serial) {
        setSupported(false);
        return;
      }
      const port = await navigator.serial.requestPort();
      await port.open({baudRate});
      portRef.current = port;

      // 直接拿 Uint8Array 流（不再走 TextDecoderStream）
      readerRef.current = port.readable!.getReader();
      writerRef.current = port.writable!.getWriter();

      setConnected(true);
      setStats({tx: 0, rx: 0});
      appendLog(`${T.connectedMsg[locale]}${baudRate}`, 'out');

      // reader loop：单实例，避免关闭后残留
      if (!readerLoopRunningRef.current) {
        readerLoopRunningRef.current = true;
        void (async () => {
          const reader = readerRef.current;
          if (!reader) {
            readerLoopRunningRef.current = false;
            return;
          }
          try {
            while (true) {
              const {value, done} = await reader.read();
              if (done) break;
              if (value && value.length > 0) pushReceived(value);
            }
          } catch {
            // 端口被关闭时结束循环
          } finally {
            readerLoopRunningRef.current = false;
          }
        })();
      }
    } catch (e) {
      setError(toError(e, locale));
    }
  };

  const send = async (textOverride?: string) => {
    const payload = (textOverride ?? input).trim();
    if (!portRef.current || !writerRef.current || !payload) return;
    setError('');
    try {
      let bytes: Uint8Array;
      let displayText: string;
      if (hexMode) {
        const parsed = parseHexInput(payload);
        if (!parsed) {
          setError(T.hexFormatError[locale]);
          return;
        }
        bytes = parsed;
        displayText = payload;
      } else {
        const data = addNewline ? payload + '\r\n' : payload;
        bytes = new TextEncoder().encode(data);
        displayText = payload;
      }
      await writerRef.current.write(bytes);
      setStats(s => ({...s, tx: s.tx + bytes.length}));
      appendLog(displayText, 'out');
      if (textOverride === undefined) setInput('');
    } catch (e) {
      setError(toError(e, locale));
    }
  };

  const clearLog = () => setLogs([]);

  // 自动发送循环
  useEffect(() => {
    if (!autoSendEnabled || !connected) {
      if (autoSendTimerRef.current !== null) {
        clearInterval(autoSendTimerRef.current);
        autoSendTimerRef.current = null;
      }
      return;
    }
    if (!autoSendText.trim()) {
      setAutoSendEnabled(false);
      setError(T.autoEmpty[locale]);
      return;
    }
    autoSendCancelledRef.current = false;
    autoSendTimerRef.current = window.setInterval(
      () => {
        if (autoSendCancelledRef.current) return;
        void send(autoSendText);
      },
      Math.max(100, autoSendInterval),
    );
    return () => {
      if (autoSendTimerRef.current !== null) {
        clearInterval(autoSendTimerRef.current);
        autoSendTimerRef.current = null;
      }
    };
  }, [
    autoSendEnabled,
    autoSendInterval,
    autoSendText,
    connected,
    hexMode,
    addNewline,
  ]);

  return (
    <Layout title={T.title[locale]} description={T.desc[locale]}>
      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>{T.title[locale]}</h1>
          <p className={styles.subtitle}>{T.subtitle[locale]}</p>
        </div>

        {!supported && (
          <div className={styles.warning}>{T.unsupported[locale]}</div>
        )}

        <div className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="baud">
                {T.baud[locale]}
              </label>
              <select
                id="baud"
                className={styles.select}
                value={baudRate}
                disabled={connected}
                onChange={e => setBaudRate(Number(e.target.value))}
              >
                {BAUD_RATES.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {connected ? (
              <button className={styles.btn} onClick={() => void disconnect()}>
                {T.disconnect[locale]}
              </button>
            ) : (
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => void connect()}
                disabled={!supported}
              >
                {T.connect[locale]}
              </button>
            )}

            <button
              className={styles.btn}
              onClick={() => setPaused(p => !p)}
              disabled={logs.length === 0}
            >
              {paused ? T.resume[locale] : T.pause[locale]}
            </button>

            <button
              className={styles.btn}
              onClick={clearLog}
              disabled={logs.length === 0}
            >
              {T.clear[locale]}
            </button>

            <div className={styles.status}>
              <span
                className={`${styles.dot} ${connected ? styles.dotOn : ''}`}
              />
              {connected ? T.connected[locale] : T.disconnected[locale]}
              {connected && (
                <span className={styles.stats}>
                  RX {stats.rx}B / TX {stats.tx}B
                </span>
              )}
            </div>
          </div>

          <div ref={logRef} className={styles.log}>
            {logs.length === 0 ? (
              <span className={styles.logLine} style={{opacity: 0.4}}>
                {T.waiting[locale]}
              </span>
            ) : (
              logs.map(l => (
                <span
                  key={l.id}
                  className={`${styles.logLine} ${l.dir === 'out' ? styles.logOut : styles.logIn}`}
                >
                  <span className={styles.logTime}>{l.time}</span>
                  {l.text}
                </span>
              ))
            )}
            {paused && logs.length > 0 && (
              <div className={styles.pausedBadge}>{T.pausedBadge[locale]}</div>
            )}
          </div>

          <div className={styles.error}>{error}</div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={input}
              placeholder={
                hexMode ? T.placeholderHex[locale] : T.placeholderText[locale]
              }
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') void send();
              }}
            />
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => void send()}
              disabled={!connected}
            >
              {T.send[locale]}
            </button>
          </div>

          <div
            className={styles.inputRow}
            style={{marginTop: 12, flexWrap: 'wrap', gap: 16}}
          >
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={hexMode}
                onChange={e => {
                  setHexMode(e.target.checked);
                  if (e.target.checked) setAddNewline(false);
                }}
              />
              {T.hexSend[locale]}
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={hexReceive}
                onChange={e => setHexReceive(e.target.checked)}
              />
              {T.hexReceive[locale]}
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={addNewline}
                onChange={e => setAddNewline(e.target.checked)}
                disabled={hexMode}
              />
              {T.appendCrlf[locale]}
            </label>
          </div>

          <details className={styles.advanced}>
            <summary>{T.autoSend[locale]}</summary>
            <div className={styles.advancedBody}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auto-text">
                  {T.sendContent[locale]}
                </label>
                <input
                  id="auto-text"
                  className={styles.input}
                  value={autoSendText}
                  placeholder={
                    autoSendHex
                      ? T.placeholderAutoHex[locale]
                      : T.placeholderAutoText[locale]
                  }
                  onChange={e => setAutoSendText(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auto-interval">
                  {T.interval[locale]}
                </label>
                <input
                  id="auto-interval"
                  className={styles.input}
                  type="number"
                  min={100}
                  step={50}
                  value={autoSendInterval}
                  onChange={e =>
                    setAutoSendInterval(
                      Math.max(100, Number(e.target.value) || 1000),
                    )
                  }
                />
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={autoSendHex}
                  onChange={e => {
                    setAutoSendHex(e.target.checked);
                    if (e.target.checked) setHexMode(true);
                  }}
                />
                {T.sendAsHex[locale]}
              </label>
              <button
                className={`${styles.btn} ${autoSendEnabled ? styles.btnDanger : styles.btnPrimary}`}
                onClick={() => setAutoSendEnabled(v => !v)}
                disabled={!connected || !autoSendText.trim()}
              >
                {autoSendEnabled ? T.stopAuto[locale] : T.startAuto[locale]}
              </button>
            </div>
          </details>
        </div>
      </main>
    </Layout>
  );
}
