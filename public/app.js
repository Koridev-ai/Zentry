const loginEl = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const loginSubtitle = document.getElementById('loginSubtitle');
const loginSubmit = document.getElementById('loginSubmit');
const loginToggle = document.getElementById('loginToggle');
const loginError = document.getElementById('loginError');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const homeEl = document.getElementById('home');
const chatList = document.getElementById('chatList');
const newChatBtn = document.getElementById('newChatBtn');
const logoutBtn = document.getElementById('logoutBtn');
const chatEl = document.getElementById('chat');
const chatBack = document.getElementById('chatBack');
const avatarBtn = document.getElementById('avatarBtn');
const avatarInput = document.getElementById('avatarInput');
const groupTitle = document.getElementById('groupTitle');
const chatName = document.getElementById('chatName');
const statusEl = document.getElementById('status');
const messagesEl = document.getElementById('messages');
const sendForm = document.getElementById('sendForm');
const msgInput = document.getElementById('msgInput');
const groupInfo = document.getElementById('groupInfo');
const infoBack = document.getElementById('infoBack');
const infoAvatar = document.getElementById('infoAvatar');
const infoName = document.getElementById('infoName');
const infoCount = document.getElementById('infoCount');
const memberList = document.getElementById('memberList');
const memberMore = document.getElementById('memberMore');
const newChatEl = document.getElementById('newChat');
const newBack = document.getElementById('newBack');
const newGroupRow = document.getElementById('newGroupRow');
const userList = document.getElementById('userList');
const userEmpty = document.getElementById('userEmpty');
const newGroupEl = document.getElementById('newGroup');
const groupBack = document.getElementById('groupBack');
const groupNameInput = document.getElementById('groupNameInput');
const pickList = document.getElementById('pickList');
const createGroupBtn = document.getElementById('createGroupBtn');
const toastEl = document.getElementById('toast');

const COLORS = ['#53bdeb', '#e26ab6', '#ffa726', '#9ccc65', '#ba68c8', '#4db6ac', '#ff7043', '#fdd835'];
const MEMBERS_PREVIEW = 7;
const CHAT_VIEWS = ['chat', 'info'];
const HOME_VIEWS = ['list', 'new', 'newgroup'];

let token = localStorage.getItem('chat_token') || '';
let me = null;
let registerMode = false;
let chats = [];
let chatsSig = '';
let current = null;
let view = 'list';
let seen = new Set();
let lastId = 0;
let members = [];
let showAllMembers = false;
let statusText = '';
let typingNames = [];
let lastTypingSent = 0;
let pickUsers = [];
let picked = new Set();
let source = null;
let lastEventAt = 0;
let pollTimer = null;
let watchTimer = null;
let polling = false;

function authQuery() {
  return 'token=' + encodeURIComponent(token);
}

async function api(path, body) {
  const url = path + (path.includes('?') ? '&' : '?') + authQuery();
  const options = body === undefined
    ? {}
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  const response = await fetch(url, options);
  if (response.status === 401) {
    endSession();
    throw new Error('auth');
  }
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

function colorFor(key) {
  let hash = 0;
  for (const ch of String(key)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatListTime(ts) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ts >= startToday) return formatTime(ts);
  if (ts >= startToday - 86400000) return 'Ayer';
  return new Date(ts).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function initialOf(name) {
  return (Array.from(String(name).trim())[0] || '?').toUpperCase();
}

function avatarUrl(chat) {
  return '/api/group-avatar?conv=' + encodeURIComponent(chat.id) + '&' + authQuery() + '&v=' + chat.avatar;
}

function avatarContent(container, chat) {
  container.textContent = '';
  container.style.background = colorFor(chat.id);
  container.style.color = '#0b141a';
  const letter = document.createElement('span');
  letter.textContent = initialOf(chat.name);
  container.appendChild(letter);
  if (chat.type === 'group' && chat.avatar) {
    const img = document.createElement('img');
    img.alt = '';
    img.addEventListener('error', () => img.remove());
    img.src = avatarUrl(chat);
    container.appendChild(img);
  }
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2000);
}

function showView(name) {
  view = name;
  if (!CHAT_VIEWS.includes(name)) current = null;
  homeEl.classList.toggle('hidden', !HOME_VIEWS.includes(name));
  chatEl.classList.toggle('hidden', !CHAT_VIEWS.includes(name));
  groupInfo.classList.toggle('hidden', name !== 'info');
  newChatEl.classList.toggle('hidden', name !== 'new');
  newGroupEl.classList.toggle('hidden', name !== 'newgroup');
  if (name === 'list') refreshChats();
}

function enter(name, replace) {
  if (replace) history.replaceState({ v: name }, '');
  else history.pushState({ v: name }, '');
  showView(name);
}

function goBack() {
  history.back();
}

window.addEventListener('popstate', event => {
  const name = (event.state && event.state.v) || 'list';
  if (CHAT_VIEWS.includes(name) && !current) {
    showView('list');
    return;
  }
  showView(name);
});

function renderStatus() {
  const group = !!current && current.type === 'group';
  if (typingNames.length === 1) {
    statusEl.textContent = group ? typingNames[0] + ' está escribiendo...' : 'escribiendo...';
  } else if (typingNames.length === 2) {
    statusEl.textContent = typingNames[0] + ' y ' + typingNames[1] + ' están escribiendo...';
  } else if (typingNames.length > 2) {
    statusEl.textContent = typingNames.length + ' personas están escribiendo...';
  } else {
    statusEl.textContent = statusText;
  }
  statusEl.classList.toggle('typing', typingNames.length > 0);
}

function setStatus(text) {
  statusText = text;
  renderStatus();
}

function setTyping(list) {
  typingNames = list.filter(item => !me || item.id !== me.id).map(item => item.name);
  renderStatus();
}

function previewText(chat) {
  if (!chat.last) return '';
  if (chat.last.system) return chat.last.text;
  if (chat.last.mine) return 'Tú: ' + chat.last.text;
  if (chat.type === 'group') return chat.last.user + ': ' + chat.last.text;
  return chat.last.text;
}

function chatRow(chat) {
  const row = document.createElement('li');
  row.className = 'chat-item';
  row.addEventListener('click', () => openConv(chat, false));

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatarContent(avatar, chat);
  row.appendChild(avatar);

  const main = document.createElement('div');
  main.className = 'chat-main';

  const top = document.createElement('div');
  top.className = 'chat-row';
  const name = document.createElement('span');
  name.className = 'chat-name';
  name.textContent = chat.name;
  top.appendChild(name);
  const time = document.createElement('span');
  time.className = 'chat-time' + (chat.unread ? ' unread' : '');
  time.textContent = chat.last ? formatListTime(chat.last.time) : '';
  top.appendChild(time);
  main.appendChild(top);

  const bottom = document.createElement('div');
  bottom.className = 'chat-row';
  const preview = document.createElement('span');
  if (chat.typing && chat.typing.length) {
    preview.className = 'chat-preview typing';
    preview.textContent = chat.type === 'group' ? chat.typing[0] + ' está escribiendo...' : 'escribiendo...';
  } else {
    preview.className = 'chat-preview' + (chat.last && chat.last.system ? ' system' : '');
    preview.textContent = previewText(chat);
  }
  bottom.appendChild(preview);
  if (chat.unread) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = chat.unread > 99 ? '99+' : String(chat.unread);
    bottom.appendChild(badge);
  }
  main.appendChild(bottom);

  row.appendChild(main);
  return row;
}

function renderChatList() {
  chatList.textContent = '';
  chats.forEach(chat => chatList.appendChild(chatRow(chat)));
}

function sortChats() {
  chats.sort((a, b) => (b.last ? b.last.time : b.sortTime) - (a.last ? a.last.time : a.sortTime));
}

async function refreshChats() {
  if (!token) return;
  try {
    const result = await api('/api/chats');
    if (!result.ok) return;
    const sig = JSON.stringify(result.data);
    if (sig === chatsSig) return;
    chatsSig = sig;
    chats = result.data;
    renderChatList();
  } catch {}
}

function touchChats() {
  chatsSig = '';
  renderChatList();
}

function renderMessage(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);
  if (message.id > lastId) lastId = message.id;

  if (message.system) {
    const note = document.createElement('div');
    note.className = 'msg system';
    note.textContent = message.text;
    const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
    messagesEl.appendChild(note);
    if (atBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
    return;
  }

  const mine = !!me && message.uid === me.id;
  const wrapper = document.createElement('div');
  wrapper.className = 'msg ' + (mine ? 'mine' : 'other');

  if (!mine && current && current.type === 'group') {
    const author = document.createElement('div');
    author.className = 'author';
    author.style.color = colorFor(message.uid || message.user);
    author.textContent = message.user;
    wrapper.appendChild(author);
  }

  const text = document.createElement('div');
  text.textContent = message.text;
  wrapper.appendChild(text);

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = formatTime(message.time);
  wrapper.appendChild(time);

  const nearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
  messagesEl.appendChild(wrapper);
  if (nearBottom || mine) messagesEl.scrollTop = messagesEl.scrollHeight;
}

function markRead() {
  if (!current || document.visibilityState !== 'visible') return;
  const chat = chats.find(item => item.id === current.id);
  if (chat && chat.unread) {
    chat.unread = 0;
    touchChats();
  }
  api('/api/read?conv=' + encodeURIComponent(current.id), {}).catch(() => {});
}

function applyHeader() {
  chatName.textContent = current.name;
  avatarContent(avatarBtn, current);
  avatarBtn.style.cursor = current.type === 'group' ? 'pointer' : 'default';
  groupTitle.classList.toggle('clickable', current.type === 'group');
}

async function loadChat() {
  const convId = current.id;
  messagesEl.textContent = '';
  seen = new Set();
  lastId = 0;
  members = [];
  typingNames = [];
  statusText = '';
  renderStatus();
  applyHeader();
  try {
    const result = await api('/api/history?conv=' + encodeURIComponent(convId));
    if (!current || current.id !== convId) return;
    if (!result.ok) {
      showToast('No se pudo abrir el chat');
      goBack();
      return;
    }
    result.data.forEach(renderMessage);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    markRead();
    refreshMembers();
  } catch {}
}

function openConv(chat, replace) {
  current = { ...chat };
  enter('chat', replace);
  loadChat();
}

async function refreshMembers() {
  if (!current) return;
  const convId = current.id;
  try {
    const result = await api('/api/members?conv=' + encodeURIComponent(convId));
    if (!current || current.id !== convId || !result.ok) return;
    members = result.data.members;
    if (current.type === 'dm') {
      const peer = members.find(item => item.id !== me.id);
      setStatus(peer && peer.online ? 'en línea' : 'desconectado');
    } else {
      const count = result.data.online;
      setStatus(count + (count === 1 ? ' persona en línea' : ' personas en línea'));
    }
    setTyping(result.data.typing);
    renderMembers();
  } catch {}
}

function onIncoming(data) {
  const conv = data.conv;
  const message = { ...data };
  delete message.conv;
  const chat = chats.find(item => item.id === conv);
  const open = !!current && current.id === conv;
  if (!chat) {
    refreshChats();
  } else {
    if (!message.system || !chat.last) {
      chat.last = { text: message.text, time: message.time, user: message.user || '', mine: !!me && message.uid === me.id, system: !!message.system };
    }
    if (!open && !message.system && !chat.last.mine) chat.unread += 1;
    sortChats();
    touchChats();
  }
  if (open) {
    renderMessage(message);
    if (!message.system && message.uid !== me.id) markRead();
  }
}

function onTypingEvent(data) {
  const chat = chats.find(item => item.id === data.conv);
  if (chat) {
    chat.typing = data.typing.filter(item => !me || item.id !== me.id).map(item => item.name);
    touchChats();
  }
  if (current && current.id === data.conv) setTyping(data.typing);
}

function onGroupEvent(data) {
  const chat = chats.find(item => item.id === data.conv);
  if (chat) {
    chat.avatar = data.avatar;
    touchChats();
  }
  if (current && current.id === data.conv) {
    current.avatar = data.avatar;
    applyHeader();
    avatarContent(infoAvatar, current);
  }
}

async function poll() {
  if (polling || !token) return;
  polling = true;
  try {
    if (current && CHAT_VIEWS.includes(view)) {
      const convId = current.id;
      const result = await api('/api/history?conv=' + encodeURIComponent(convId) + '&after=' + lastId);
      if (current && current.id === convId && result.ok) {
        result.data.forEach(renderMessage);
        if (result.data.some(item => !item.system && item.uid !== me.id)) markRead();
      }
      await refreshMembers();
    } else {
      await refreshChats();
    }
  } catch {
  } finally {
    polling = false;
  }
}

function openSource() {
  if (source) source.close();
  lastEventAt = Date.now();
  source = new EventSource('/api/events?' + authQuery());
  source.onopen = () => {
    lastEventAt = Date.now();
  };
  source.onerror = () => {
    if (current) setStatus('reconectando...');
  };
  source.onmessage = event => {
    lastEventAt = Date.now();
    onIncoming(JSON.parse(event.data));
  };
  source.addEventListener('typing', event => {
    lastEventAt = Date.now();
    onTypingEvent(JSON.parse(event.data));
  });
  source.addEventListener('group', event => {
    lastEventAt = Date.now();
    onGroupEvent(JSON.parse(event.data));
  });
  source.addEventListener('presence', () => {
    lastEventAt = Date.now();
    poll();
  });
  source.addEventListener('chats', () => {
    lastEventAt = Date.now();
    refreshChats();
  });
  source.addEventListener('ping', () => {
    lastEventAt = Date.now();
  });
}

function stopEvents() {
  if (source) source.close();
  source = null;
  clearInterval(pollTimer);
  clearInterval(watchTimer);
  pollTimer = null;
  watchTimer = null;
}

function connectEvents() {
  stopEvents();
  openSource();
  pollTimer = setInterval(poll, 2500);
  watchTimer = setInterval(() => {
    if (Date.now() - lastEventAt > 40000) openSource();
  }, 10000);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !token || !pollTimer) return;
  poll();
  markRead();
  if (Date.now() - lastEventAt > 20000) openSource();
});

function memberRow(person, online, isMe) {
  const row = document.createElement('li');
  row.className = 'member';

  const avatar = document.createElement('div');
  avatar.className = 'member-avatar';
  avatar.style.background = colorFor(person.id);
  avatar.textContent = initialOf(person.name);
  row.appendChild(avatar);

  const info = document.createElement('div');
  info.className = 'member-info';
  const title = document.createElement('span');
  title.className = 'member-name';
  title.textContent = isMe ? 'Tú' : person.name;
  info.appendChild(title);
  const state = document.createElement('span');
  state.className = 'member-state' + (online ? ' on' : '');
  state.textContent = online ? '✦ en línea' : 'desconectado';
  info.appendChild(state);
  row.appendChild(info);

  return row;
}

function renderMembers() {
  if (!me || !current) return;
  const others = members.filter(item => item.id !== me.id);
  const total = members.some(item => item.id === me.id) ? members.length : others.length + 1;
  infoCount.textContent = total + (total === 1 ? ' miembro' : ' miembros');

  memberList.textContent = '';
  memberList.appendChild(memberRow(me, true, true));

  const visible = showAllMembers ? others : others.slice(0, MEMBERS_PREVIEW - 1);
  visible.forEach(item => memberList.appendChild(memberRow(item, item.online, false)));

  const hidden = others.length - visible.length;
  if (hidden > 0) {
    memberMore.textContent = 'Ver todos (' + hidden + ' más)';
    memberMore.classList.remove('hidden');
  } else {
    memberMore.classList.add('hidden');
  }
}

function openGroupInfo() {
  if (!current || current.type !== 'group') return;
  showAllMembers = false;
  infoName.textContent = current.name;
  avatarContent(infoAvatar, current);
  renderMembers();
  enter('info', false);
  refreshMembers();
}

async function openNewChat() {
  enter('new', false);
  userList.textContent = '';
  userEmpty.classList.add('hidden');
  try {
    const result = await api('/api/users');
    if (!result.ok) return;
    pickUsers = result.data;
    if (!pickUsers.length) userEmpty.classList.remove('hidden');
    pickUsers.forEach(person => {
      const row = memberRow(person, person.online, false);
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => startDm(person));
      userList.appendChild(row);
    });
  } catch {}
}

async function startDm(person) {
  try {
    const result = await api('/api/dm', { userId: person.id });
    if (!result.ok) return showToast('No se pudo abrir el chat');
    openConv(result.data, true);
  } catch {}
}

function updateCreateButton() {
  createGroupBtn.disabled = !(groupNameInput.value.trim() && picked.size > 0);
}

function renderPick() {
  pickList.textContent = '';
  pickUsers.forEach(person => {
    const row = memberRow(person, person.online, false);
    row.classList.add('pick-row');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = picked.has(person.id);
    row.appendChild(box);
    row.addEventListener('click', () => {
      if (picked.has(person.id)) picked.delete(person.id);
      else picked.add(person.id);
      box.checked = picked.has(person.id);
      updateCreateButton();
    });
    pickList.appendChild(row);
  });
}

function openNewGroup() {
  picked = new Set();
  groupNameInput.value = '';
  renderPick();
  updateCreateButton();
  enter('newgroup', true);
}

async function createGroup() {
  const name = groupNameInput.value.trim();
  if (!name || picked.size === 0) return;
  createGroupBtn.disabled = true;
  try {
    const result = await api('/api/groups', { name, members: [...picked] });
    if (!result.ok) {
      showToast('No se pudo crear el grupo');
      updateCreateButton();
      return;
    }
    openConv(result.data, true);
  } catch {
    updateCreateButton();
  }
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.getContext('2d').drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size
      );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    img.src = url;
  });
}

function showLogin() {
  loginEl.classList.remove('hidden');
  [homeEl, chatEl, groupInfo, newChatEl, newGroupEl].forEach(item => item.classList.add('hidden'));
  usernameInput.focus();
}

function showLoginError(text) {
  loginError.textContent = text;
  loginError.classList.remove('hidden');
  showLogin();
}

function setMode(register) {
  registerMode = register;
  loginSubtitle.textContent = register ? 'Crea tu cuenta para entrar' : 'Inicia sesión para entrar';
  loginSubmit.textContent = register ? 'Crear cuenta' : 'Entrar';
  loginToggle.textContent = register ? '¿Ya tienes cuenta? Entrar' : '¿No tienes cuenta? Crear una';
  passwordInput.autocomplete = register ? 'new-password' : 'current-password';
  loginError.classList.add('hidden');
}

function clearSession() {
  token = '';
  me = null;
  current = null;
  chats = [];
  chatsSig = '';
  localStorage.removeItem('chat_token');
}

function endSession() {
  stopEvents();
  clearSession();
  showLogin();
}

async function enterApp() {
  let response;
  try {
    response = await fetch('/api/me?' + authQuery());
  } catch {
    showLoginError('No se pudo conectar con el servidor');
    return;
  }
  if (!response.ok) {
    clearSession();
    showLogin();
    return;
  }
  me = (await response.json()).user;
  loginEl.classList.add('hidden');
  history.replaceState({ v: 'list' }, '');
  showView('list');
  await refreshChats();
  connectEvents();
}

avatarBtn.addEventListener('click', () => {
  if (current && current.type === 'group') avatarInput.click();
});

avatarInput.addEventListener('change', async () => {
  const file = avatarInput.files[0];
  avatarInput.value = '';
  if (!file || !current) return;
  try {
    const image = await resizeImage(file);
    const result = await api('/api/group-avatar?conv=' + encodeURIComponent(current.id), { image });
    if (!result.ok) throw new Error('upload');
    showToast('Foto del grupo actualizada');
  } catch {
    showToast('No se pudo cambiar la foto');
  }
});

groupTitle.addEventListener('click', openGroupInfo);
chatBack.addEventListener('click', goBack);
infoBack.addEventListener('click', goBack);
newBack.addEventListener('click', goBack);
groupBack.addEventListener('click', goBack);
newChatBtn.addEventListener('click', openNewChat);
newGroupRow.addEventListener('click', openNewGroup);
groupNameInput.addEventListener('input', updateCreateButton);
createGroupBtn.addEventListener('click', createGroup);

memberMore.addEventListener('click', () => {
  showAllMembers = true;
  renderMembers();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && view !== 'list' && token) goBack();
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/logout?' + authQuery(), { method: 'POST' });
  } catch {}
  clearSession();
  location.reload();
});

msgInput.addEventListener('input', () => {
  if (!current || !msgInput.value.trim()) return;
  const now = Date.now();
  if (now - lastTypingSent < 2500) return;
  lastTypingSent = now;
  api('/api/typing?conv=' + encodeURIComponent(current.id), {}).catch(() => {});
});

sendForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text || !current) return;
  const convId = current.id;
  msgInput.value = '';
  lastTypingSent = 0;
  try {
    const result = await api('/api/send?conv=' + encodeURIComponent(convId), { text });
    if (result.ok && current && current.id === convId) renderMessage(result.data);
  } catch {}
  msgInput.focus();
});

loginToggle.addEventListener('click', () => setMode(!registerMode));

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) return;
  loginSubmit.disabled = true;
  try {
    const response = await fetch(registerMode ? '/api/register' : '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (data.error === 'credentials') showLoginError('Usuario o contraseña incorrectos');
      else if (data.error === 'taken') showLoginError('Ese usuario ya existe');
      else if (data.error === 'rate') showLoginError('Demasiados intentos, espera un minuto');
      else showLoginError('Usuario: 3 a 20 caracteres (letras, números, _ . -). Contraseña: mínimo 6');
      return;
    }
    token = data.token;
    localStorage.setItem('chat_token', token);
    passwordInput.value = '';
    loginError.classList.add('hidden');
    enterApp();
  } catch {
    showLoginError('No se pudo iniciar sesión');
  } finally {
    loginSubmit.disabled = false;
  }
});

history.replaceState({ v: 'list' }, '');
if (token) enterApp();
else showLogin();
