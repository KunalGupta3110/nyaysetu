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

function normalizeStoredUser(user) {
  if (!user) return null;
  const profile = user.profile || {};
  return {
    ...user,
    role: user.role || profile.role || 'user',
    city: user.city || profile.city || '',
    college: user.college || profile.college || '',
    year: user.year || profile.year || profile.year_of_study || '',
    area: user.area || profile.area || profile.area_of_interest || ''
  };
}

function getStoredUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('nyaysetu_user') || 'null');
    return normalizeStoredUser(user);
  } catch (err) {
    return null;
  }
}

function saveAuthSession(data) {
  if (data.token) localStorage.setItem('nyaysetu_token', data.token);
  if (data.user) {
    const user = normalizeStoredUser(data.user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('nyaysetu_user', JSON.stringify(user));
  }
}

function getHomeHref() {
  return window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

function getAuthHref() {
  return window.location.pathname.includes('/pages/') ? 'auth.html' : 'pages/auth.html';
}

function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('nyaysetu_token');
  localStorage.removeItem('nyaysetu_user');
  window.location.reload();
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
  const slots = document.querySelectorAll('#auth-nav-slot, #auth-nav-slot-mobile');
  if (!slots.length) return;

  const user = getStoredUser();
  slots.forEach(slot => {
    const isMobileSlot = slot.id === 'auth-nav-slot-mobile';
    const btnStyle = isMobileSlot ? 'width: 100%; text-align: center; justify-content: center;' : '';
    
    if (user) {
      const displayName = user.name || user.full_name || user.email || 'User';
      slot.innerHTML = `
        <span class="nav-user-name" style="${isMobileSlot ? 'display:block; margin-bottom: 8px; text-align:center;' : ''}">${esc(displayName)}</span>
        <button class="btn-nav" type="button" onclick="logoutUser()" style="${btnStyle}">Logout</button>
      `;
    } else {
      slot.innerHTML = `<a href="${getAuthHref()}" class="btn-nav" style="${btnStyle}">Login / Signup</a>`;
    }
  });
}

// ── NAV ACTIVE STATE ──
function initMobileNav() {
  const nav = document.getElementById('nav');
  const tabs = nav?.querySelector('.nav-tabs');
  if (!nav || !tabs || nav.querySelector('.nav-menu-toggle')) return;

  const btn = document.createElement('button');
  btn.className = 'nav-menu-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';

  const closeMenu = () => {
    tabs.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = tabs.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  tabs.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  nav.appendChild(btn);
}

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
  initMobileNav();
  setTimeout(initMobileNav, 0);
  initScrollAnim();
  if (typeof initI18n === 'function') initI18n();
});
