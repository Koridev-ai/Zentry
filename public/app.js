const loginEl = document.getElementById('login');
const chatEl = document.getElementById('chat');
const sendForm = document.getElementById('sendForm');
const msgInput = document.getElementById('msgInput');
const messagesEl = document.getElementById('messages');
const statusEl = document.getElementById('status');
const loginError = document.getElementById('loginError');
const loginForm = document.getElementById('loginForm');
const loginSubtitle = document.getElementById('loginSubtitle');
const loginSubmit = document.getElementById('loginSubmit');
const loginToggle = document.getElementById('loginToggle');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const toastEl = document.getElementById('toast');
const avatarBtn = document.getElementById('avatarBtn');
const avatarImg = document.getElementById('avatarImg');
const avatarLetter = document.getElementById('avatarLetter');
const avatarInput = document.getElementById('avatarInput');
const groupTitle = document.getElementById('groupTitle');
const groupInfo = document.getElementById('groupInfo');
const infoBack = document.getElementById('infoBack');
const infoImg = document.getElementById('infoImg');
const infoLetter = document.getElementById('infoLetter');
const infoCount = document.getElementById('infoCount');
const memberList = document.getElementById('memberList');
const memberMore = document.getElementById('memberMore');
const logoutBtn = document.getElementById('logoutBtn');

const COLORS = ['#53bdeb', '#e26ab6', '#ffa726', '#9ccc65', '#ba68c8', '#4db6ac', '#ff7043', '#fdd835'];
const MEMBERS_PREVIEW = 7;
const seen = new Set();
let members = [];
let showAllMembers = false;
let me = null;
let registerMode = false;
let token = localStorage.getItem('chat_token') || '';

function authQuery() {
  return 'token=' + encodeURIComponent(token);
}

function colorFor(key) {
  let hash = 0;
  for (const ch of String(key)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function initialOf(name) {
  return (Array.from(String(name).trim())[0] || '?').toUpperCase();
}

function renderMessage(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);

  if (message.system) {
    const note = document.createElement('div');
    note.className = 'msg system';
    note.textContent = message.text;
    if (message.text.endsWith('cambió la foto del grupo')) setAvatar(message.time);
    const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
    messagesEl.appendChild(note);
    if (atBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
    return;
  }

  const mine = !!me && message.uid === me.id;
  const wrapper = document.createElement('div');
  wrapper.className = 'msg ' + (mine ? 'mine' : 'other');

  if (!mine) {
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

async function loadGroup() {
  try {
    const response = await fetch('/api/group?' + authQuery());
    if (!response.ok) return;
    setAvatar((await response.json()).avatar);
  } catch {}
}

async function loadHistory() {
  const response = await fetch('/api/history?' + authQuery());
  if (!response.ok) return false;
  const history = await response.json();
  history.forEach(renderMessage);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return true;
}

function applyPresence(data) {
  const count = data.online;
  statusEl.textContent = count + (count === 1 ? ' persona en línea' : ' personas en línea');
  if (Array.isArray(data.members)) {
    members = data.members;
    renderMembers();
  }
}

function connectEvents() {
  const source = new EventSource('/api/events?' + authQuery());
  let poller = null;
  let opened = false;
  const poll = async () => {
    try {
      const response = await fetch('/api/history?' + authQuery());
      if (!response.ok) return;
      (await response.json()).forEach(renderMessage);
      loadGroup();
      const info = await fetch('/api/members?' + authQuery());
      if (info.ok) applyPresence(await info.json());
      else statusEl.textContent = 'en línea';
    } catch {}
  };
  const startPolling = () => {
    if (poller) return;
    poll();
    poller = setInterval(poll, 1500);
  };
  setTimeout(() => {
    if (!opened) startPolling();
  }, 3000);
  source.onopen = () => {
    opened = true;
    if (poller) {
      clearInterval(poller);
      poller = null;
    }
  };
  source.onerror = () => {
    opened = false;
    statusEl.textContent = 'reconectando...';
    startPolling();
  };
  source.onmessage = event => renderMessage(JSON.parse(event.data));
  source.addEventListener('group', event => setAvatar(JSON.parse(event.data).avatar));
  source.addEventListener('presence', event => {
    if (poller) {
      clearInterval(poller);
      poller = null;
    }
    opened = true;
    applyPresence(JSON.parse(event.data));
  });
}

function showLoginError(text) {
  loginError.textContent = text;
  loginError.classList.remove('hidden');
  loginEl.classList.remove('hidden');
  chatEl.classList.add('hidden');
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2000);
}

function clearSession() {
  token = '';
  me = null;
  localStorage.removeItem('chat_token');
}

function setMode(register) {
  registerMode = register;
  loginSubtitle.textContent = register ? 'Crea tu cuenta para entrar' : 'Inicia sesión para entrar';
  loginSubmit.textContent = register ? 'Crear cuenta' : 'Entrar';
  loginToggle.textContent = register ? '¿Ya tienes cuenta? Entrar' : '¿No tienes cuenta? Crear una';
  passwordInput.autocomplete = register ? 'new-password' : 'current-password';
  loginError.classList.add('hidden');
}

function showLogin() {
  loginEl.classList.remove('hidden');
  chatEl.classList.add('hidden');
  usernameInput.focus();
}

async function enterChat() {
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
  await loadHistory();
  loginEl.classList.add('hidden');
  chatEl.classList.remove('hidden');
  loadGroup();
  connectEvents();
  msgInput.focus();
}

function setAvatar(version) {
  if (!version) return;
  const src = '/api/group-avatar?' + authQuery() + '&v=' + version;
  avatarImg.src = src;
  avatarImg.classList.remove('hidden');
  avatarLetter.classList.add('hidden');
  infoImg.src = src;
  infoImg.classList.remove('hidden');
  infoLetter.classList.add('hidden');
}

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
  if (!me) return;
  const others = members.filter(item => item.id !== me.id);
  const total = others.length + 1;
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

async function openGroupInfo() {
  showAllMembers = false;
  renderMembers();
  groupInfo.classList.remove('hidden');
  try {
    const response = await fetch('/api/members?' + authQuery());
    if (!response.ok) return;
    members = (await response.json()).members;
    renderMembers();
  } catch {}
}

function closeGroupInfo() {
  groupInfo.classList.add('hidden');
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

avatarImg.addEventListener('error', () => {
  avatarImg.classList.add('hidden');
  avatarLetter.classList.remove('hidden');
});

infoImg.addEventListener('error', () => {
  infoImg.classList.add('hidden');
  infoLetter.classList.remove('hidden');
});

avatarBtn.addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', async () => {
  const file = avatarInput.files[0];
  avatarInput.value = '';
  if (!file) return;
  try {
    const image = await resizeImage(file);
    const response = await fetch('/api/group-avatar?' + authQuery(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });
    if (!response.ok) throw new Error('upload');
    showToast('Foto del grupo actualizada');
  } catch {
    showToast('No se pudo cambiar la foto');
  }
});

groupTitle.addEventListener('click', openGroupInfo);
infoBack.addEventListener('click', closeGroupInfo);
memberMore.addEventListener('click', () => {
  showAllMembers = true;
  renderMembers();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeGroupInfo();
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/logout?token=' + encodeURIComponent(token), { method: 'POST' });
  } catch {}
  clearSession();
  location.reload();
});

sendForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;
  msgInput.value = '';
  try {
    const response = await fetch('/api/send?' + authQuery(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (response.ok) renderMessage(await response.json());
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
    enterChat();
  } catch {
    showLoginError('No se pudo iniciar sesión');
  } finally {
    loginSubmit.disabled = false;
  }
});

if (token) enterChat();
else showLogin();
