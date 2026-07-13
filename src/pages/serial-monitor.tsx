import {useEffect, useRef, useState, type ReactNode, useCallback} from 'react';
import Layout from '@theme/Layout';

import styles from './serial-monitor.module.css';

type LogDir = 'in' | 'out';

interface LogEntry {
  id: number;
  text: string;
  dir: LogDir;
  time: string;
}

interface SerialPortLike {
  open(opts: {baudRate: number; dataBits?: number; stopBits?: number; parity?: string; flowControl?: string}): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
  getInfo(): {usbVendorId?: number; usbProductId?: number};
}

declare global {
  interface Navigator {
    serial?: {
      requestPort(opts?: {filters?: Array<{usbVendorId?: number; usbProductId?: number}>}): Promise<SerialPortLike>;
      getPorts(): Promise<SerialPortLike[]>;
    };
  }
}

const BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];
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
  const parts = text.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return null;
  const bytes = new Uint8Array(parts.length);
  for (let i = 0; i < parts.length; i++) {
    const n = parseInt(parts[i], 16);
    if (Number.isNaN(n) || n < 0 || n > 255) return null;
    bytes[i] = n;
  }
  return bytes;
};

// 将浏览器原生（多为英文）报错转换为中文提示
const toChineseError = (e: unknown): string => {
  const msg = e instanceof Error ? e.message : String(e);
  if (/abort/i.test(msg)) return '已取消操作（未选择串口）';
  if (/open/i.test(msg)) return '打开串口失败：设备可能被占用或已断开';
  if (/write|flush|send/i.test(msg)) return '发送失败：串口可能已断开';
  if (/read/i.test(msg)) return '读取失败：串口可能已断开';
  if (/network|frame|parity|overrun/i.test(msg)) {
    return `串口通信异常：${msg}（请检查波特率/接线）`;
  }
  return `操作失败：${msg}`;
};

export default function SerialMonitor(): ReactNode {
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
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
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
    flushTimerRef.current = window.setTimeout(flushLogs, RING_BUFFER_BATCH_MS);
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
          : truncateChunks(chunks, total);
      payload = bytesToHex(merged);
    } else {
      // 文本模式：用 TextDecoder 解码
      const merged =
        total <= MAX_DECODE_BYTES_PER_CHUNK ? mergeChunks(chunks, total) : truncateChunks(chunks, total);
      try {
        payload = new TextDecoder('utf-8', {fatal: false}).decode(merged);
      } catch {
        payload = bytesToHex(merged);
      }
    }

    appendLog(payload, 'in');
  }, [hexReceive]);

  function mergeChunks(chunks: Uint8Array[], total: number): Uint8Array {
    const merged = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) {
      merged.set(c, off);
      off += c.length;
    }
    return merged;
  }

  function truncateChunks(chunks: Uint8Array[], total: number): Uint8Array {
    // 单批超限：只取末尾部分，但保留 HEX/文本可读性
    const take = MAX_DECODE_BYTES_PER_CHUNK;
    let acc = new Uint8Array(take);
    let head = 0;
    let remaining = take;
    for (let i = chunks.length - 1; i >= 0 && remaining > 0; i--) {
      const c = chunks[i];
      const start = Math.max(0, c.length - remaining);
      const slice = c.subarray(start);
      acc.set(slice, head);
      head += slice.length;
      remaining -= slice.length;
    }
    return acc.subarray(0, head);
  }

  const appendLog = (text: string, dir: LogDir) => {
    if (!text) return;
    const time = new Date().toLocaleTimeString('zh-CN', {hour12: false});
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
    appendLog('已断开连接', 'out');
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
      appendLog(`已连接，波特率 ${baudRate}`, 'out');

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
      setError(toChineseError(e));
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
          setError('十六进制格式错误（应为 00-FF 的空格分隔字节）');
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
      setError(toChineseError(e));
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
      setError('自动发送内容为空，已暂停');
      return;
    }
    autoSendCancelledRef.current = false;
    autoSendTimerRef.current = window.setInterval(() => {
      if (autoSendCancelledRef.current) return;
      void send(autoSendText);
    }, Math.max(100, autoSendInterval));
    return () => {
      if (autoSendTimerRef.current !== null) {
        clearInterval(autoSendTimerRef.current);
        autoSendTimerRef.current = null;
      }
    };
  }, [autoSendEnabled, autoSendInterval, autoSendText, connected, hexMode, addNewline]);

  return (
    <Layout title="串口监视器" description="通过浏览器进行串口数据的发送与接收">
      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>串口监视器</h1>
          <p className={styles.subtitle}>
            通过浏览器 Web Serial API 与串口设备通信（需使用 Chrome / Edge 等 Chromium 内核浏览器，并通过 HTTPS 访问）
          </p>
        </div>

        {!supported && (
          <div className={styles.warning}>
            当前浏览器不支持 Web Serial API。请使用最新版 Chrome、Edge 或 Opera 打开本页面，并确保通过 HTTPS 访问。
          </div>
        )}

        <div className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="baud">
                波特率
              </label>
              <select
                id="baud"
                className={styles.select}
                value={baudRate}
                disabled={connected}
                onChange={e => setBaudRate(Number(e.target.value))}>
                {BAUD_RATES.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {connected ? (
              <button className={styles.btn} onClick={() => void disconnect()}>
                断开连接
              </button>
            ) : (
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => void connect()}
                disabled={!supported}>
                连接串口
              </button>
            )}

            <button
              className={styles.btn}
              onClick={() => setPaused(p => !p)}
              disabled={logs.length === 0}>
              {paused ? '继续显示' : '暂停显示'}
            </button>

            <button className={styles.btn} onClick={clearLog} disabled={logs.length === 0}>
              清空
            </button>

            <div className={styles.status}>
              <span className={`${styles.dot} ${connected ? styles.dotOn : ''}`} />
              {connected ? '已连接' : '未连接'}
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
                等待数据…
              </span>
            ) : (
              logs.map(l => (
                <span
                  key={l.id}
                  className={`${styles.logLine} ${l.dir === 'out' ? styles.logOut : styles.logIn}`}>
                  <span className={styles.logTime}>{l.time}</span>
                  {l.text}
                </span>
              ))
            )}
            {paused && logs.length > 0 && (
              <div className={styles.pausedBadge}>已暂停，新数据不展示</div>
            )}
          </div>

          <div className={styles.error}>{error}</div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={input}
              placeholder={hexMode ? '十六进制，如：48 49 0A' : '输入要发送的内容'}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') void send();
              }}
            />
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => void send()}
              disabled={!connected}>
              发送
            </button>
          </div>

          <div className={styles.inputRow} style={{marginTop: 12, flexWrap: 'wrap', gap: 16}}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={hexMode}
                onChange={e => {
                  setHexMode(e.target.checked);
                  if (e.target.checked) setAddNewline(false);
                }}
              />
              HEX 发送
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={hexReceive}
                onChange={e => setHexReceive(e.target.checked)}
              />
              HEX 接收
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={addNewline}
                onChange={e => setAddNewline(e.target.checked)}
                disabled={hexMode}
              />
              发送时自动追加 CRLF
            </label>
          </div>

          <details className={styles.advanced}>
            <summary>定时发送（自动循环）</summary>
            <div className={styles.advancedBody}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auto-text">
                  发送内容
                </label>
                <input
                  id="auto-text"
                  className={styles.input}
                  value={autoSendText}
                  placeholder={autoSendHex ? 'HEX 字节，如 01 03 00 00' : '要循环发送的文本'}
                  onChange={e => setAutoSendText(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auto-interval">
                  间隔 (ms)
                </label>
                <input
                  id="auto-interval"
                  className={styles.input}
                  type="number"
                  min={100}
                  step={50}
                  value={autoSendInterval}
                  onChange={e => setAutoSendInterval(Math.max(100, Number(e.target.value) || 1000))}
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
                以 HEX 形式发送
              </label>
              <button
                className={`${styles.btn} ${autoSendEnabled ? styles.btnDanger : styles.btnPrimary}`}
                onClick={() => setAutoSendEnabled(v => !v)}
                disabled={!connected || !autoSendText.trim()}>
                {autoSendEnabled ? '停止定时发送' : '启动定时发送'}
              </button>
            </div>
          </details>
        </div>
      </main>
    </Layout>
  );
}
