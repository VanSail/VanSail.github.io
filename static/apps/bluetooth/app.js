const en = new URLSearchParams(location.search).get('lang') === 'en';
const t = (zh, english) => (en ? english : zh);
const el = id => document.getElementById(id);
const connect = el('connect');
const services = el('services');
const results = el('results');
const status = el('status');
const choose = t('选择设备', 'Choose device');
const idle = t('尚未连接设备', 'No device connected');
const empty = t(
  '连接后可查看已授权服务及其特征。',
  'Connect to inspect authorized services and their characteristics.',
);
document.documentElement.lang = en ? 'en' : 'zh-CN';
document.title = el('title').textContent = t('蓝牙助手', 'Bluetooth Assistant');
if (en) {
  document.documentElement.lang = 'en';
  const labels = {
    串口助手: 'Serial Assistant',
    未连接: 'Disconnected',
    设备连接: 'Device connection',
    选择设备: 'Select device',
    断开连接: 'Disconnect',
    波特率: 'Baud rate',
    自定义波特率: 'Custom baud rate',
    展开波特率候选: 'Show baud rate options',
    常用波特率: 'Common baud rates',
    数据位: 'Data bits',
    校验位: 'Parity',
    无: 'None',
    偶校验: 'Even',
    奇校验: 'Odd',
    停止位: 'Stop bits',
    流控: 'Flow control',
    硬件流控: 'Hardware flow control',
    设备显示名称: 'Device display name',
    可修改设备显示名称: 'Edit device display name',
    终端设置: 'Terminal settings',
    显示: 'Display',
    'UTF-8 文本': 'UTF-8 text',
    'HEX · 十六进制': 'HEX · hexadecimal',
    'BIN · 二进制': 'BIN · binary',
    暂停查看: 'Pause display',
    清空记录: 'Clear log',
    输入: 'Input',
    本地回显: 'Local echo',
    收发终端: 'Bluetooth terminal',
    交互式蓝牙终端: 'Interactive Bluetooth terminal',
  };
  const walker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT,
  );
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const key = node.textContent.trim();
    if (Object.hasOwn(labels, key))
      node.textContent = node.textContent.replace(key, labels[key]);
  }
  for (const element of document.querySelectorAll(
    '[aria-label], [title], [placeholder]',
  )) {
    for (const name of ['aria-label', 'title', 'placeholder']) {
      const value = element.getAttribute(name);
      if (Object.hasOwn(labels, value))
        element.setAttribute(name, labels[value]);
    }
  }
}

const foldSettings = el('foldSettings');
function showSettings(open) {
  el('deviceSettings').hidden = el('terminalSettings').hidden = !open;
  foldSettings.setAttribute('aria-expanded', String(open));
  foldSettings.textContent = open
    ? t('收起配置', 'Collapse settings')
    : t('展开配置', 'Expand settings');
}
foldSettings.onclick = () => showSettings(el('deviceSettings').hidden);
showSettings(true);

el('label').textContent = t(
  '服务 UUID（选填，多个用逗号分隔）',
  'Service UUIDs (optional, comma-separated)',
);
el('heading').textContent = t('设备服务', 'Device services');
let device;
let session = 0;

function reset(message) {
  session++;
  resetTerminal();
  device?.removeEventListener('gattserverdisconnected', disconnected);
  device = undefined;
  connect.disabled = services.disabled = false;
  connect.textContent = choose;
  status.textContent = message;
  results.textContent = empty;
}
function disconnected() {
  reset(t('设备已断开', 'Device disconnected'));
}
function parseServices() {
  return services.value
    .trim()
    .split(/[,，\s]+/)
    .filter(Boolean)
    .map(value => {
      if (/^(?:0x)?(?:[\da-f]{4}|[\da-f]{8})$/i.test(value))
        return parseInt(value, 16);
      if (/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value))
        return value.toLowerCase();
      throw new Error(
        t(
          '请输入有效的 16、32 或 128 位服务 UUID。',
          'Enter a valid 16-, 32- or 128-bit service UUID.',
        ),
      );
    });
}
function showCharacteristic(parent, characteristic) {
  const row = document.createElement('article');
  const uuid = document.createElement('code');
  uuid.textContent = characteristic.uuid;
  row.append(uuid);
  if (characteristic.properties.read) {
    const read = document.createElement('button');
    const output = document.createElement('output');
    read.textContent = t('读取 HEX', 'Read HEX');
    read.onclick = async () => {
      read.disabled = true;
      try {
        const data = await characteristic.readValue();
        output.textContent =
          Array.from(
            new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
            byte => byte.toString(16).padStart(2, '0'),
          )
            .join(' ')
            .toUpperCase() || t('空值', 'Empty value');
      } catch (error) {
        output.textContent = error.message;
      } finally {
        read.disabled = false;
      }
    };
    row.append(read, output);
  }
  parent.append(row);
}
const writers = [];
const receivers = [];
let subscribed;
let writer;
const tx = el('tx');
const rx = el('rx');
let stream;
let writeTask = Promise.resolve();
const {terminal, record, resetDigits, cancelLab} = createDeviceTerminal({
  localized: t,
  isOpen: () => Boolean(writer),
  enqueue(bytes) {
    if (!bytes.length) return;
    const channel = writer;
    const attempt = session;
    writeTask = writeTask
      .then(async () => {
        // BLE UART devices commonly accept 20 payload bytes per packet.
        for (let offset = 0; offset < bytes.length; offset += 20) {
          if (session !== attempt) return;
          const chunk = bytes.subarray(offset, offset + 20);
          if (channel.properties.write)
            await channel.writeValueWithResponse(chunk);
          else await channel.writeValueWithoutResponse(chunk);
          if (session === attempt) record(stream, 'TX', chunk);
        }
      })
      .catch(error => {
        if (session === attempt) log(error.message);
      });
  },
});
el('connectionTitle').textContent = t('设备连接', 'Device connection');
el('pairHelp').textContent = t(
  '若设备要求配对，请在系统蓝牙设置中完成配对，再连接设备。访问受保护的特征时，系统也可能提示输入 PIN 或确认配对。',
  'If your device requires pairing, pair in system Bluetooth settings, then connect the device. Accessing a protected characteristic may also prompt for a PIN or confirmation.',
);
el('txLabel').textContent = t('发送命令的特征', 'Command characteristic');
el('rxLabel').textContent = t('接收回复的特征', 'Reply characteristic');

function log(line) {
  el('hint').textContent = line;
}
function receive(event) {
  if (event.target === subscribed)
    record(
      stream,
      'RX',
      new Uint8Array(
        event.target.value.buffer,
        event.target.value.byteOffset,
        event.target.value.byteLength,
      ),
    );
}
function resetTerminal() {
  cancelLab();
  subscribed?.removeEventListener('characteristicvaluechanged', receive);
  subscribed = writer = undefined;
  writers.length = receivers.length = 0;
  tx.replaceChildren();
  rx.replaceChildren(new Option(t('仅发送', 'Send only'), ''));
  tx.disabled = rx.disabled = true;
  log('');
  resetDigits();
  stream = {decoder: new TextDecoder(), txDecoder: new TextDecoder()};
  writeTask = Promise.resolve();
}
function addChannel(item) {
  const label = item.service.uuid.slice(0, 8) + ' / ' + item.uuid;
  if (item.properties.write || item.properties.writeWithoutResponse) {
    tx.add(new Option(label, String(writers.length)));
    writers.push(item);
  }
  if (item.properties.notify || item.properties.indicate) {
    rx.add(new Option(label, String(receivers.length)));
    if (!receivers.length) rx.value = '0';
    receivers.push(item);
  }
}
async function activateTerminal() {
  cancelLab();
  const attempt = session;
  const receiver = receivers[rx.value];
  writer = undefined;
  tx.disabled = rx.disabled = true;
  try {
    await writeTask;
    if (attempt !== session) return;
    if (subscribed && subscribed !== receiver) {
      await subscribed.stopNotifications();
      if (attempt !== session) return;
      subscribed.removeEventListener('characteristicvaluechanged', receive);
      subscribed = undefined;
    }
    if (receiver && subscribed !== receiver) {
      receiver.addEventListener('characteristicvaluechanged', receive);
      subscribed = receiver;
      try {
        await receiver.startNotifications();
      } catch (error) {
        receiver.removeEventListener('characteristicvaluechanged', receive);
        if (attempt === session) subscribed = undefined;
        throw error;
      }
    }
    if (attempt !== session) return;
    log(t('终端已就绪', 'Terminal ready'));
  } catch (error) {
    if (attempt !== session) return;
    rx.value = subscribed ? String(receivers.indexOf(subscribed)) : '';
    log(t('接收设置失败：', 'Receive setup failed: ') + error.message);
  } finally {
    if (attempt === session) {
      writer = writers[tx.value];
      tx.disabled = !writers.length;
      rx.disabled = !receivers.length;
      terminal.focus();
    }
  }
}
tx.onchange = rx.onchange = activateTerminal;
reset(idle);
if (!window.isSecureContext || !navigator.bluetooth) {
  status.textContent = t(
    '请通过 HTTPS 或 localhost 在支持 Web Bluetooth 的浏览器中打开。',
    'Open over HTTPS or localhost in a browser with Web Bluetooth support.',
  );
  connect.disabled = true;
}
connect.onclick = async () => {
  if (device?.gatt.connected) {
    device.gatt.disconnect();
    return;
  }
  const attempt = ++session;
  connect.disabled = services.disabled = true;
  try {
    const optionalServices = [
      'battery_service',
      'device_information',
      'heart_rate',
      0xffe0,
      '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      ...parseServices(),
    ];
    status.textContent = t('等待选择设备…', 'Waiting for a device…');
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices,
    });
    device.addEventListener('gattserverdisconnected', disconnected);
    status.textContent = t('正在连接…', 'Connecting…');
    const server = await device.gatt.connect();
    if (session !== attempt) return;
    connect.textContent = t('断开连接', 'Disconnect');
    connect.disabled = false;
    status.textContent =
      t('已连接 · ', 'Connected · ') +
      (device.name || t('未命名设备', 'Unnamed device'));
    results.textContent = t('正在发现服务…', 'Discovering services…');
    const list = await server.getPrimaryServices();
    if (session !== attempt) return;
    results.textContent = list.length
      ? ''
      : t(
          '没有可访问的服务。断开后可填写设备服务 UUID 重试。',
          'No accessible services. Disconnect and enter the device service UUID to retry.',
        );
    for (const service of list) {
      if (session !== attempt) return;
      const group = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = service.uuid;
      group.append(summary);
      results.append(group);
      try {
        const characteristics = await service.getCharacteristics();
        if (session !== attempt) return;
        for (const item of characteristics) {
          showCharacteristic(group, item);
          addChannel(item);
        }
      } catch (error) {
        group.append(error.message);
      }
    }
    if (session === attempt) {
      const uart = writers.findIndex(item =>
        [
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '0000ffe0-0000-1000-8000-00805f9b34fb',
        ].includes(item.service.uuid),
      );
      if (uart >= 0) tx.value = String(uart);
      const reply = receivers.findIndex(
        item => item.service === writers[tx.value]?.service,
      );
      if (reply >= 0) rx.value = String(reply);
      await activateTerminal();
      if (session !== attempt) return;
      if (!writers.length)
        log(
          t(
            '未发现可写特征。请填写设备的命令服务 UUID 后重新连接。',
            'No writable characteristic. Enter the command service UUID and reconnect.',
          ),
        );
    }
  } catch (error) {
    if (session !== attempt) return;
    if (device?.gatt.connected) {
      results.textContent =
        t(
          '无法读取服务，请检查服务 UUID。 ',
          'Unable to discover services. Check the service UUIDs. ',
        ) + error.message;
    } else {
      reset(
        error.name === 'NotFoundError'
          ? t('未选择设备，可重新选择。', 'No device selected. Try again.')
          : error.message,
      );
    }
  }
};
window.addEventListener('pagehide', () => device?.gatt?.disconnect());
