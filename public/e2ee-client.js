/*
 * Capa de cliente del cifrado de extremo a extremo.
 * Guarda la clave privada del dispositivo en IndexedDB (no extraíble),
 * registra la pública en el servidor y cifra/descifra los mensajes.
 */
(function () {
  'use strict';

  const E = window.ZentryE2EE;
  const DB_NAME = 'zentry-e2ee';
  const DIR_TTL = 60 * 1000;
  const LOCKED_TEXT = '🔒 No se pudo descifrar este mensaje';
  const OLD_TEXT = '🔒 Mensaje enviado antes de que este dispositivo existiera';

  let authHeaders = () => ({});
  let identity = null;
  let ready = null;
  let owner = '';
  const directories = new Map();

  function idb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('keys');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function idbGet(key) {
    const db = await idb();
    return new Promise((resolve, reject) => {
      const request = db.transaction('keys').objectStore('keys').get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function idbSet(key, value) {
    const db = await idb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('keys', 'readwrite');
      tx.objectStore('keys').put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function post(path, body) {
    const response = await fetch(path, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
    return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
  }

  async function get(path) {
    const response = await fetch(path, { headers: authHeaders() });
    return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
  }

  // Crea la clave de este dispositivo la primera vez y la registra en cada sesión.
  function init(userId, headersFn) {
    if (headersFn) authHeaders = headersFn;
    if (ready && owner === userId) return ready;
    owner = userId;
    directories.clear();
    ready = (async () => {
      if (!E.supported()) throw new Error('unsupported');
      let saved = await idbGet('identity:' + userId);
      if (!saved) {
        saved = await E.generateIdentity();
        await idbSet('identity:' + userId, { privateKey: saved.privateKey, publicKey: saved.publicKey, pub: saved.pub, kid: saved.kid });
      }
      identity = saved;
      const result = await post('/api/e2ee/register', { pub: saved.pub });
      if (!result.ok) throw new Error('register');
      return true;
    })();
    ready.catch(() => {
      ready = null;
    });
    return ready;
  }

  function available() {
    return !!identity;
  }

  async function directory(convId, force) {
    const cached = directories.get(convId);
    if (cached && !force && Date.now() - cached.at < DIR_TTL) return cached;
    const result = await get('/api/e2ee/keys?conv=' + encodeURIComponent(convId));
    if (!result.ok) throw new Error('directory');
    const entry = { at: Date.now(), sealed: result.data.sealed !== false, keys: result.data.keys || [] };
    directories.set(convId, entry);
    return entry;
  }

  function forget(convId) {
    directories.delete(convId);
  }

  async function isSealed(convId) {
    try {
      return (await directory(convId)).sealed;
    } catch {
      return false;
    }
  }

  // Devuelve el cuerpo listo para /api/send.
  async function seal(convId, payload) {
    await ready;
    const dir = await directory(convId, true);
    if (!dir.sealed) return null;
    const envelope = await E.encrypt(identity, { conv: convId, uid: owner }, dir.keys, payload);
    return { e2ee: envelope };
  }

  function markLocked(message, text) {
    message.text = text;
    message.undecryptable = true;
    delete message.mentions;
    delete message.reply;
    return message;
  }

  // Descifra un mensaje en el sitio. Los mensajes sin sobre (sistema, bots, medios) se dejan igual.
  async function open(convId, message) {
    if (!message || !message.e2ee || message.sealedOpen) return message;
    try {
      await ready;
      const envelope = message.e2ee;
      if (!envelope.w || !envelope.w[identity.kid]) return markLocked(message, OLD_TEXT);
      let dir = await directory(convId);
      let sender = dir.keys.find(key => key.kid === envelope.s && key.uid === message.uid);
      if (!sender) {
        dir = await directory(convId, true);
        sender = dir.keys.find(key => key.kid === envelope.s && key.uid === message.uid);
      }
      if (!sender) return markLocked(message, LOCKED_TEXT);
      const payload = await E.decrypt(identity, { conv: convId, uid: message.uid }, envelope, sender.pub);
      message.text = String(payload.text || '');
      if (payload.reply && typeof payload.reply === 'object') {
        message.reply = {
          id: Number(payload.reply.id) || 0,
          uid: String(payload.reply.uid || ''),
          user: String(payload.reply.user || '').slice(0, 40),
          text: String(payload.reply.text || '').slice(0, 200)
        };
      }
      if (Array.isArray(payload.mentions)) {
        message.mentions = payload.mentions.slice(0, 20).map(item => ({ id: String(item.id || ''), name: String(item.name || '').slice(0, 40) }));
      }
      message.sealedOpen = true;
      return message;
    } catch {
      return markLocked(message, LOCKED_TEXT);
    }
  }

  async function openAll(convId, list) {
    for (const message of list) await open(convId, message);
    return list;
  }

  // Vista previa de la lista de chats: el servidor solo manda el sobre del último mensaje.
  async function openPreview(chat) {
    const last = chat && chat.last;
    if (!last || !last.e2ee) return chat;
    const message = { uid: last.uid, e2ee: last.e2ee, text: '' };
    await open(chat.id, message);
    last.text = message.undecryptable ? '🔒 Mensaje cifrado' : message.text;
    last.sealedText = true;
    delete last.e2ee;
    return chat;
  }

  async function safetyNumber(convId, peerId) {
    await ready;
    const dir = await directory(convId, true);
    const mine = dir.keys.filter(key => key.uid === owner);
    const theirs = dir.keys.filter(key => key.uid === peerId);
    if (!mine.length || !theirs.length) return '';
    return E.safetyNumber(mine, theirs);
  }

  window.ZentryE2E = { init, available, seal, open, openAll, openPreview, isSealed, forget, safetyNumber, LOCKED_TEXT };
})();
