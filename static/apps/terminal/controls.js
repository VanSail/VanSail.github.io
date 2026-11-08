function createDeviceTerminal({localized, isOpen, enqueue}) {
  const $ = id => document.getElementById(id);
  let records = [],
    rx = 0,
    tx = 0,
    digits = '';
  const encoder = new TextEncoder();
  let paused = false,
    waitingBytes = 0,
    waitingCount = 0;
  function pauseLabel() {
    $('pause').setAttribute('aria-pressed', String(paused));
    $('pause').textContent = paused
      ? localized('恢复查看 · ', 'Resume display · ') + waitingBytes + ' B'
      : localized('暂停查看', 'Pause display');
  }
  const hex = bytes =>
    Array.from(bytes, b => b.toString(16).padStart(2, '0'))
      .join(' ')
      .toUpperCase();
  const terminal = new Terminal({
    cursorBlink: true,
    scrollback: 3000,
    fontSize: 14,
    fontFamily: 'Menlo, Consolas, monospace',
    theme: {background: '#161616', foreground: '#eeeeee', cursor: '#eeeeee'},
    allowProposedApi: false,
  });
  terminal.open($('screen'));
  function fit() {
    const box = $('screen'),
      sample = document.createElement('span');
    sample.style.cssText =
      'position:absolute;visibility:hidden;font:14px Menlo,Consolas,monospace';
    sample.textContent = 'MMMMMMMMMM';
    box.append(sample);
    const width = sample.getBoundingClientRect().width / 10;
    sample.remove();
    if (width)
      terminal.resize(
        Math.max(10, Math.floor((box.clientWidth - 18) / width)),
        Math.max(4, Math.floor(box.clientHeight / 17)),
      );
  }
  new ResizeObserver(fit).observe($('screen'));
  function display(r) {
    if (r.dir === 'TX' && !r.echo) return;
    const view = $('view').value;
    if (view === 'text') terminal.write(r.text);
    else {
      const values =
        view === 'hex'
          ? hex(r.bytes)
          : Array.from(r.bytes, b => b.toString(2).padStart(8, '0')).join(' ');
      terminal.write(values + ' ');
    }
  }
  function redraw() {
    terminal.reset();
    records.forEach(display);
  }
  function record(s, dir, data) {
    const bytes = new Uint8Array(data);
    if (dir === 'RX') rx += bytes.length;
    else tx += bytes.length;
    $('count').textContent = 'RX ' + rx + ' B · TX ' + tx + ' B';
    const r = {
      dir,
      bytes,
      text: (dir === 'RX' ? s.decoder : s.txDecoder).decode(bytes, {
        stream: true,
      }),
      echo: $('echo').checked,
    };
    records.push(r);
    if (records.length > 2000) records.shift();
    if (paused) {
      waitingCount++;
      if (dir === 'RX') waitingBytes += bytes.length;
      pauseLabel();
    } else display(r);
  }
  function digitHint() {
    $('badge').textContent = digits
      ? localized('待补全字节：', 'Incomplete byte: ') + digits
      : '';
  }
  function input(data) {
    if (!isOpen()) return;
    const tail = {cr: '\r', lf: '\n', both: '\r\n'}[$('ending').value] || '';
    if ($('format').value === 'text') {
      enqueue(encoder.encode(data === '\r' ? tail : data));
      return;
    }
    const bin = $('format').value === 'bin',
      width = bin ? 8 : 2;
    if (data === '\x7f' || data === '\b') {
      digits = digits.slice(0, -1);
      digitHint();
      return;
    }
    if (data === '\r') {
      if (digits) {
        $('hint').textContent = localized(
          '请先补全当前字节，或按退格删除。',
          'Complete the current byte or press Backspace to delete it.',
        );
        return;
      }
      enqueue(encoder.encode(tail));
      return;
    }
    const clean = data.replace(/\s/g, '');
    if (!(bin ? /^[01]*$/ : /^[\da-f]*$/i).test(clean)) {
      $('hint').textContent = bin
        ? localized('BIN 仅接受 0 和 1。', 'BIN accepts only 0 and 1.')
        : localized('HEX 仅接受 0–9 和 A–F。', 'HEX accepts only 0–9 and A–F.');
      return;
    }
    digits += clean;
    const bytes = [];
    while (digits.length >= width) {
      bytes.push(parseInt(digits.slice(0, width), bin ? 2 : 16));
      digits = digits.slice(width);
    }
    digitHint();
    enqueue(Uint8Array.from(bytes));
  }
  terminal.onData(input);
  $('format').onchange = () => {
    digits = '';
    digitHint();
    terminal.focus();
  };
  $('pause').onclick = () => {
    if (paused) {
      if (waitingCount > records.length) redraw();
      else if (waitingCount) records.slice(-waitingCount).forEach(display);
      terminal.scrollToBottom();
    }
    paused = !paused;
    waitingBytes = waitingCount = 0;
    $('view').disabled = paused;
    pauseLabel();
  };
  $('view').onchange = redraw;
  $('clear').onclick = () => {
    records = [];
    waitingBytes = waitingCount = 0;
    pauseLabel();
    digits = '';
    digitHint();
    rx = tx = 0;
    $('count').textContent = 'RX 0 B · TX 0 B';
    redraw();
  };

  return {
    terminal,
    record,
    resetDigits() {
      digits = '';
      digitHint();
    },
  };
}
