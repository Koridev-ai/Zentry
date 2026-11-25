try {
  importScripts('/e2ee.js');
} catch {}

const ICON = '/icon-192.png';
const MAX_LINES = 5;
const MAX_AVATAR = 400 * 1024;
const MAX_CACHED_AVATARS = 60;
const AVATAR_TIMEOUT = 4000;
const avatarCache = new Map();
const MAX_PREVIEW = 240;
const DB_NAME = 'zentry-e2ee';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {}
  event.waitUntil(showMessage(data));
});

function readIdentity(uid) {
  return new Promise(resolve => {
    let request;
    try {
      request = indexedDB.open(DB_NAME, 1);
    } catch {
      resolve(null);
      return;
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('keys')) request.result.createObjectStore('keys');
    };
    request.onerror = () => resolve(null);
    request.onsuccess = () => {
      const db = request.result;
      try {
        const get = db.transaction('keys').objectStore('keys').get('identity:' + uid);
        get.onsuccess = () => {
          db.close();
          resolve(get.result || null);
        };
        get.onerror = () => {
          db.close();
          resolve(null);
        };
      } catch {
        db.close();
        resolve(null);
      }
    };
  });
}

function clip(text) {
  const chars = Array.from(String(text || ''));
  return chars.length > MAX_PREVIEW ? chars.slice(0, MAX_PREVIEW - 1).join('') + '…' : chars.join('');
}

function describe(payload) {
  const media = payload.media && typeof payload.media === 'object' ? payload.media : null;
  const text = String(payload.text || '');
  if (media) {
    if (media.kind === 'audio') return '🎵 ' + (media.name || 'Envió un audio.');
    if (media.kind === 'video') return '🎥 ' + (text || 'Envió un video.');
    if (media.kind === 'doc') return '📄 ' + (media.name || 'Envió un documento.');
    if (media.kind === 'sticker') return '🖼️ Envió un sticker.';
    if (media.kind === 'image') return '📷 ' + (text || 'Envió una foto.');
  }
  return text;
}

async function avatarIcon(data) {
  if (!(Number(data.av) > 0)) return ICON;
  const isDm = data.type === 'dm';
  const key = (isDm ? 'u:' + data.uid : 'g:' + data.conv) + ':' + Number(data.av);
  if (avatarCache.has(key)) return avatarCache.get(key);
  const url = isDm ? '/api/user-avatar?id=' + encodeURIComponent(data.uid) : '/api/group-avatar?conv=' + encodeURIComponent(data.conv);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AVATAR_TIMEOUT);
  try {
    const response = await fetch(url, { credentials: 'same-origin', signal: controller.signal });
    if (!response.ok) return ICON;
    const buffer = await response.arrayBuffer();
    if (!buffer.byteLength || buffer.byteLength > MAX_AVATAR) return ICON;
    const type = response.headers.get('Content-Type') || 'image/jpeg';
    const icon = 'data:' + type + ';base64,' + self.ZentryE2EE.b64(new Uint8Array(buffer));
    avatarCache.set(key, icon);
    if (avatarCache.size > MAX_CACHED_AVATARS) avatarCache.delete(avatarCache.keys().next().value);
    return icon;
  } catch {
    return ICON;
  } finally {
    clearTimeout(timer);
  }
}

async function openSealed(data) {
  if (!self.ZentryE2EE || !data.e2ee || !data.to || !data.spub) return null;
  const identity = await readIdentity(data.to);
  if (!identity || !identity.privateKey || !identity.kid || !data.e2ee.w || !data.e2ee.w[identity.kid]) return null;
  try {
    const payload = await self.ZentryE2EE.decrypt(identity, { conv: String(data.conv || ''), uid: String(data.uid || '') }, data.e2ee, data.spub);
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}

async function bodyFor(data) {
  if (!data.e2ee) return String(data.body || 'Nuevo mensaje');
  const payload = await openSealed(data);
  const isDm = data.type === 'dm';
  const sender = String(data.sender || '');
  if (!payload) return isDm || !sender ? 'Nuevo mensaje' : sender + ': Nuevo mensaje';
  const text = clip(describe(payload)) || 'Nuevo mensaje';
  const mentioned = Array.isArray(payload.mentions) && payload.mentions.some(item => item && String(item.id) === String(data.to));
  if (mentioned) return sender + ' te mencionó: ' + text;
  return isDm || !sender ? text : sender + ': ' + text;
}

async function showMessage(data) {
  const title = String(data.title || 'Zentry');
  const [body, icon] = await Promise.all([bodyFor(data), avatarIcon(data)]);
  const conv = data.conv ? String(data.conv) : '';
  const tag = conv ? 'conv-' + conv : 'zentry';
  let previous = {};
  try {
    const existing = await self.registration.getNotifications({ tag });
    if (existing.length && existing[0].data) previous = existing[0].data;
  } catch {}
  const lines = (Array.isArray(previous.lines) ? previous.lines : []).concat(body).slice(-MAX_LINES);
  const count = (Number(previous.count) || 0) + 1;
  await self.registration.showNotification(count > 1 ? title + ' (' + count + ' mensajes)' : title, {
    body: lines.join('\n'),
    tag,
    renotify: true,
    icon,
    badge: ICON,
    timestamp: Number(data.time) || Date.now(),
    data: { conv, lines, count }
  });
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const conv = event.notification.data && event.notification.data.conv ? String(event.notification.data.conv) : '';
  event.waitUntil(openChat(conv));
});

async function openChat(conv) {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const target = windows.find(item => item.visibilityState === 'visible') || windows[0];
  if (target) {
    try {
      await target.focus();
    } catch {}
    target.postMessage({ type: 'open-conv', conv });
    return;
  }
  await self.clients.openWindow(conv ? '/?conv=' + encodeURIComponent(conv) : '/');
}
