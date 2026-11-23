const loginEl = document.getElementById('login');
const chatEl = document.getElementById('chat');
const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('nameInput');
const sendForm = document.getElementById('sendForm');
const msgInput = document.getElementById('msgInput');
const messagesEl = document.getElementById('messages');
const statusEl = document.getElementById('status');

const COLORS = ['#53bdeb', '#e26ab6', '#ffa726', '#9ccc65', '#ba68c8', '#4db6ac', '#ff7043', '#fdd835'];
const seen = new Set();
let username = localStorage.getItem('chat_user') || '';

function colorFor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMessage(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);

  const mine = message.user === username;
  const wrapper = document.createElement('div');
  wrapper.className = 'msg ' + (mine ? 'mine' : 'other');

  if (!mine) {
    const author = document.createElement('div');
    author.className = 'author';
    author.style.color = colorFor(message.user);
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

async function loadHistory() {
  const response = await fetch('/api/history');
  const history = await response.json();
  history.forEach(renderMessage);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function connectEvents() {
  const source = new EventSource('/api/events');
  source.onopen = () => { statusEl.textContent = 'en línea'; };
  source.onerror = () => { statusEl.textContent = 'reconectando...'; };
  source.onmessage = event => renderMessage(JSON.parse(event.data));
}

async function enterChat() {
  loginEl.classList.add('hidden');
  chatEl.classList.remove('hidden');
  await loadHistory();
  connectEvents();
  msgInput.focus();
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = nameInput.value.trim();
  if (!value) return;
  username = value;
  localStorage.setItem('chat_user', username);
  enterChat();
});

sendForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;
  msgInput.value = '';
  await fetch('/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: username, text })
  });
  msgInput.focus();
});

if (username) enterChat();
