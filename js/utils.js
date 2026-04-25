/* ═══════════════════════════════════════════
   NYAYSETU — SHARED UTILITIES
═══════════════════════════════════════════ */

// ── THEME ──
function initTheme() {
  const saved = localStorage.getItem('ns-theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = saved === 'dark' ? '☀' : '☽';
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('ns-theme', html.dataset.theme);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isDark ? '☽' : '☀';
}

const API_BASE_URL = "https://nyaysetu-a5vj.onrender.com";

// ── TOAST ──
function showToast(msg, icon = '✓') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.innerHTML = '<span id="toast-icon"></span><span id="toast-msg"></span>';
    document.body.appendChild(t);
  }
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── CLAUDE API ──
async function callClaude(system, userMsg, history = []) {

  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        system,
        message: userMsg,
        history
      })
    });

    const data = await res.json();
    return data.reply;

  } catch (err) {
    return "Unable to connect to server.";
  }
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('nyaysetu_user') || 'null');
  } catch (err) {
    return null;
  }
}

function saveAuthSession(data) {
  if (data.token) localStorage.setItem('nyaysetu_token', data.token);
  if (data.user) localStorage.setItem('nyaysetu_user', JSON.stringify(data.user));
}

function getHomeHref() {
  return window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

function getAuthHref() {
  return window.location.pathname.includes('/pages/') ? 'auth.html' : 'pages/auth.html';
}

function logoutUser() {
  localStorage.removeItem('nyaysetu_token');
  localStorage.removeItem('nyaysetu_user');
  window.location.href = getHomeHref();
}

async function authRequest(endpoint, payload) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let data = {};
  try { data = await res.json(); } catch (err) {}
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Authentication failed. Please try again.');
  }
  return data;
}

async function signupUser(payload) {
  const data = await authRequest('/signup', payload);
  saveAuthSession(data);
  return data;
}

async function loginUser(payload) {
  const data = await authRequest('/login', payload);
  saveAuthSession(data);
  return data;
}

function updateAuthNav() {
  const slot = document.getElementById('auth-nav-slot');
  if (!slot) return;

  const user = getStoredUser();
  if (user) {
    slot.innerHTML = `
      <span class="nav-user-name">${esc(user.name || 'User')}</span>
      <button class="btn-nav" type="button" onclick="logoutUser()">Logout</button>
    `;
  } else {
    slot.innerHTML = `<a href="${getAuthHref()}" class="btn-nav">Login / Signup</a>`;
  }
}

// ── NAV ACTIVE STATE ──
function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.page === page);
  });
}

// ── SCROLL ANIMATIONS ──
function initScrollAnim(scope = document) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  scope.querySelectorAll('.fi').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    obs.observe(el);
  });
}

// ── COPY TO CLIPBOARD ──
function copyText(text, msg = 'Copied!') {
  navigator.clipboard.writeText(text).then(() => showToast(msg, '📋'));
}

// ── ESCAPE HTML ──
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── FORMAT CHAT MARKDOWN ──
function formatMarkdown(text) {
  return esc(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/(Section\s[\dA-Za-z]+(?:[A-Z])?(?:\s(?:IPC|CrPC|CPC|IEA))?|IPC\s[\dA-Za-z]+|under\sthe\s[A-Z][^,\n.]{3,60}Act(?:,?\s\d{4})?)/g,
      '<span class="law-chip">$1</span>')
    .replace(/\n\n/g, '</p><p class="mb8">')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p class="mb0">').concat('</p>');
}

// ── DOWNLOAD TEXT FILE ──
function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── AUTO-INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setActiveNav();
  updateAuthNav();
  initScrollAnim();
  if (typeof initI18n === 'function') initI18n();
});
