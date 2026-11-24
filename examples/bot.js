const fs = require('fs');

const BASE = (process.env.ZENTRY_URL || 'http://localhost:3000').replace(/\/$/, '');
const NAME = process.env.BOT_NAME || 'Mi bot';
const TOKEN_FILE = process.env.BOT_TOKEN_FILE || '.zentry-bot-token';

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function call(path, body, token) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  const options = { headers };
  if (body !== undefined) {
    options.method = 'POST';
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, options);
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function link() {
  const { data } = await call('/api/link/request', { name: NAME });
  if (!data.id) throw new Error('No se pudo pedir el código');
  console.log('Código de vinculación:', data.code);
  console.log('Contenido del QR:', data.qr);
  console.log('En Zentry: Chats > ⋮ > Dispositivos vinculados > Vincular un dispositivo');
  const deadline = Date.now() + data.expiresIn * 1000;
  while (Date.now() < deadline) {
    await pause(2000);
    const result = await call('/api/link/status?id=' + data.id + '&secret=' + data.secret);
    if (result.data.status === 'approved') return result.data.token;
    if (result.data.status === 'expired') break;
  }
  throw new Error('El código venció');
}

async function getToken() {
  try {
    const saved = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
    if (saved && (await call('/api/me', undefined, saved)).status === 200) return saved;
  } catch {}
  const token = await link();
  fs.writeFileSync(TOKEN_FILE, token, { mode: 0o600 });
  return token;
}

async function send(token, conv, text) {
  await call('/api/send?conv=' + encodeURIComponent(conv), { text }, token);
}

async function listen(token, onMessage) {
  const res = await fetch(BASE + '/api/events?cid=bot&visible=0', { headers: { Authorization: 'Bearer ' + token } });
  if (res.status === 401) throw new Error('auth');
  if (!res.ok) throw new Error('events ' + res.status);
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let cut;
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      let event = 'message';
      let data = '';
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      if (event !== 'message' || !data) continue;
      try {
        onMessage(JSON.parse(data));
      } catch {}
    }
  }
}

async function main() {
  let token = await getToken();
  const me = (await call('/api/me', undefined, token)).data.user;
  console.log('Vinculado como', me.name);
  for (;;) {
    try {
      await listen(token, message => {
        if (message.system || message.uid === me.id || !message.text) return;
        if (message.text.trim() === '!ping') send(token, message.conv, 'pong');
      });
    } catch (error) {
      if (error.message === 'auth') {
        try {
          fs.unlinkSync(TOKEN_FILE);
        } catch {}
        token = await getToken();
      }
    }
    await pause(3000);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
