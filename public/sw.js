const ICON = '/icon-192.png';
const MAX_LINES = 4;

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

async function showMessage(data) {
  const title = String(data.title || 'Zentry');
  const body = String(data.body || 'Nuevo mensaje');
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
    icon: ICON,
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
