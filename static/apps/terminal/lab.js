function attachDeviceLab({localized: t, isOpen, enqueue}) {
  const button = document.createElement('button'),
    panel = document.createElement('aside');
  button.textContent = t('AI 实验室', 'AI Lab');
  button.setAttribute('aria-expanded', 'false');
  document.querySelector('header').append(button);
  panel.className = 'deviceLab';
  panel.hidden = true;
  const bar = document.createElement('div'),
    close = document.createElement('button'),
    frame = document.createElement('iframe');
  close.textContent = t('关闭', 'Close');
  bar.className = 'bar';
  bar.append(close);
  const dialog = document.createElement('dialog');
  dialog.className = 'devicePermission';
  const form = document.createElement('form');
  form.method = 'dialog';
  const title = document.createElement('h2');
  title.id = 'devicePermissionTitle';
  title.textContent = t('发送到当前设备？', 'Send to the connected device?');
  dialog.setAttribute('aria-labelledby', title.id);
  const preview = document.createElement('pre'),
    remember = document.createElement('input'),
    label = document.createElement('label');
  remember.type = 'checkbox';
  label.append(
    remember,
    t('下次不再询问（本次连接）', 'Don’t ask again for this connection'),
  );
  const actions = document.createElement('div');
  actions.className = 'actions';
  for (const [value, text] of [
    ['cancel', t('取消', 'Cancel')],
    ['send', t('发送', 'Send')],
  ]) {
    const btn = document.createElement('button');
    btn.value = value;
    btn.textContent = text;
    actions.append(btn);
  }
  form.append(title, preview, label, actions);
  dialog.append(form);
  document.body.append(dialog);
  let authorized = false;
  function ask(format, command) {
    remember.checked = false;
    dialog.returnValue = '';
    preview.textContent = format.toUpperCase() + ': ' + command;
    return new Promise(resolve => {
      dialog.addEventListener(
        'close',
        () => resolve(dialog.returnValue === 'send'),
        {once: true},
      );
      dialog.showModal();
    });
  }
  frame.title = button.textContent;
  panel.append(bar, frame);
  document.body.append(panel);
  let receiver = null,
    task = null;
  function cancel() {
    receiver?.finish('Device operation stopped');
    task = null;
    authorized = false;
    if (dialog.open) dialog.close('cancel');
    frame.contentWindow?.postMessage({type: 'device-stop'}, location.origin);
  }
  function toggle(open) {
    panel.hidden = !open;
    document.body.classList.toggle('withLab', open);
    button.setAttribute('aria-expanded', String(open));
    if (open && !frame.hasAttribute('src'))
      frame.src =
        '../ai/?device=' +
        (location.pathname.includes('/bluetooth/') ? 'bluetooth' : 'serial') +
        '&lang=' +
        document.documentElement.lang;
    if (!open) cancel();
  }
  button.onclick = () => toggle(panel.hidden);
  close.onclick = () => toggle(false);
  window.addEventListener('message', async e => {
    if (
      e.origin !== location.origin ||
      e.source !== frame.contentWindow ||
      panel.hidden
    )
      return;
    const {type, id, format, command} = e.data || {};
    if (type === 'device-cancel') {
      if (id && task !== id) return;
      if (dialog.open) dialog.close('cancel');
      receiver?.finish('Stopped');
      task = null;
      return;
    }
    if (type !== 'device-write' || typeof id !== 'string') return;
    const respond = (result, error) =>
      e.source.postMessage(
        {type: 'device-result', id, result, error},
        location.origin,
      );
    if (task || !isOpen())
      return respond(
        '',
        t(
          '请先连接设备并选择发送通道',
          'Connect a device and select its write channel first',
        ),
      );
    if (
      typeof command !== 'string' ||
      !command.trim() ||
      command.length > 1024 ||
      /[\x00-\x1f\x7f]/.test(command) ||
      !['text', 'hex'].includes(format)
    )
      return respond('', 'Invalid command');
    const hex = command.replace(/ /g, '');
    if (format === 'hex' && !/^(?:[0-9a-f]{2})+$/i.test(hex))
      return respond('', 'Invalid HEX');
    task = id;
    if (!authorized) {
      const approved = await ask(format, command);
      if (!approved || task !== id || panel.hidden || !isOpen()) {
        if (task === id) task = null;
        return respond('', t('已取消发送', 'Send canceled'));
      }
      authorized = remember.checked;
    }
    const ending =
      {cr: '\r', lf: '\n', both: '\r\n'}[
        document.getElementById('ending').value
      ] || '';
    const bytes =
      format === 'hex'
        ? Uint8Array.from(hex.match(/../g), b => parseInt(b, 16))
        : new TextEncoder().encode(command + ending);
    let idle,
      deadline,
      data = [];
    const response = new Promise(resolve => {
      const finish = error => {
        clearTimeout(idle);
        clearTimeout(deadline);
        receiver = null;
        resolve({
          error,
          result:
            format === 'hex'
              ? data.map(x => x.toString(16).padStart(2, '0')).join(' ')
              : new TextDecoder().decode(Uint8Array.from(data)),
        });
      };
      receiver = {
        finish,
        read(chunk) {
          for (const b of chunk) {
            if (data.length >= 8192) break;
            data.push(b);
          }
          clearTimeout(idle);
          idle = setTimeout(() => finish(''), 750);
        },
      };
      deadline = setTimeout(
        () =>
          finish(
            data.length ? '' : t('未收到回复，已停止。', 'No reply; stopped.'),
          ),
        8000,
      );
    });
    try {
      enqueue(bytes);
      const {result, error} = await response;
      respond(result, error);
    } finally {
      if (task === id) task = null;
    }
  });
  return {
    receive(bytes) {
      receiver?.read(bytes);
    },
    cancel,
  };
}
