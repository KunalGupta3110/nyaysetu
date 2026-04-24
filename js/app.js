/* ============================================================
   NyaySetu — Core App (app.js)
   Shared utilities, navigation, theme, i18n, toast
   ============================================================ */

// ── Translations ──────────────────────────────────────────────
const I18N = {
  en: {
    nav_chat: 'AI Chat', nav_docs: 'Documents', nav_simplify: 'Simplifier',
    nav_students: 'Students', nav_dashboard: 'Dashboard',
    hero_eyebrow: '⚡ AI-Powered Legal Intelligence for India',
    hero_title_1: 'Your Legal Rights,', hero_title_2: 'In Your Language',
    hero_subtitle: 'Ask legal questions, generate court-ready documents, and understand Indian law — powered by AI. Free and instant.',
    hero_cta: 'Start Free Chat', hero_cta2: 'Generate Document',
    stat1: 'Indian Laws Covered', stat2: 'Languages Supported', stat3: 'Documents Types',
    feat1_title: 'AI Legal Chatbot', feat1_desc: 'Ask any legal question in plain language. Get instant, accurate answers about Indian law.',
    feat2_title: 'Document Generator', feat2_desc: 'Generate legal notices, affidavits, RTI applications, rent agreements, and more.',
    feat3_title: 'Law Simplifier', feat3_desc: 'Paste complex legal text and get a clear, simple explanation with examples.',
    feat4_title: 'Student Section', feat4_desc: 'Legal notes, landmark cases, and revision tools for law students.',
    auth_title: 'Welcome to NyaySetu', auth_sub: 'Sign in to save your work',
    disclaimer: 'NyaySetu provides AI-generated legal information, not legal advice. Always consult a qualified advocate for specific legal matters.',
  },
  hi: {
    nav_chat: 'AI चैट', nav_docs: 'दस्तावेज़', nav_simplify: 'सरलीकरण',
    nav_students: 'छात्र', nav_dashboard: 'डैशबोर्ड',
    hero_eyebrow: '⚡ भारत के लिए AI कानूनी सहायता',
    hero_title_1: 'आपके कानूनी अधिकार,', hero_title_2: 'आपकी भाषा में',
    hero_subtitle: 'कानूनी सवाल पूछें, दस्तावेज़ बनाएं, और कानून समझें — AI द्वारा। मुफ़्त और तत्काल।',
    hero_cta: 'मुफ़्त चैट शुरू करें', hero_cta2: 'दस्तावेज़ बनाएं',
    stat1: 'भारतीय कानून', stat2: 'भाषाएं', stat3: 'दस्तावेज़ प्रकार',
    feat1_title: 'AI कानूनी चैटबॉट', feat1_desc: 'सरल भाषा में कोई भी कानूनी सवाल पूछें। तुरंत उत्तर पाएं।',
    feat2_title: 'दस्तावेज़ जनरेटर', feat2_desc: 'कानूनी नोटिस, शपथपत्र, RTI आवेदन और किराया समझौता बनाएं।',
    feat3_title: 'कानून सरलीकारक', feat3_desc: 'जटिल कानूनी पाठ को सरल हिंदी में समझाया जाएगा।',
    feat4_title: 'छात्र अनुभाग', feat4_desc: 'कानूनी नोट्स, ऐतिहासिक मामले और परीक्षा उपकरण।',
    auth_title: 'न्यायसेतु में स्वागत है', auth_sub: 'अपना काम सहेजने के लिए लॉगिन करें',
    disclaimer: 'न्यायसेतु AI-जनित कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। विशिष्ट मामलों के लिए योग्य अधिवक्ता से परामर्श करें।',
  },
  ta: {
    nav_chat: 'AI அரட்டை', nav_docs: 'ஆவணங்கள்', nav_simplify: 'எளிமைப்படுத்தி',
    nav_students: 'மாணவர்', nav_dashboard: 'டாஷ்போர்டு',
    hero_eyebrow: '⚡ இந்தியாவிற்கான AI சட்ட உதவி',
    hero_title_1: 'உங்கள் சட்ட உரிமைகள்,', hero_title_2: 'உங்கள் மொழியில்',
    hero_subtitle: 'சட்ட கேள்விகள் கேளுங்கள், ஆவணங்கள் உருவாக்குங்கள். இலவசம்.',
    hero_cta: 'இலவச அரட்டை தொடங்கு', hero_cta2: 'ஆவணம் உருவாக்கு',
    stat1: 'இந்திய சட்டங்கள்', stat2: 'மொழிகள்', stat3: 'ஆவண வகைகள்',
    feat1_title: 'AI சட்ட சாட்பாட்', feat1_desc: 'எளிய மொழியில் சட்ட கேள்விகள் கேளுங்கள்.',
    feat2_title: 'ஆவண ஜெனரேட்டர்', feat2_desc: 'சட்ட நோட்டீஸ், உறுதிமொழி மற்றும் RTI விண்ணப்பங்கள்.',
    feat3_title: 'சட்ட எளிமைப்படுத்தி', feat3_desc: 'சட்ட உரையை ஒட்டி எளிய விளக்கம் பெறுங்கள்.',
    feat4_title: 'மாணவர் பிரிவு', feat4_desc: 'சட்ட குறிப்புகள் மற்றும் வழக்கு சுருக்கங்கள்.',
    auth_title: 'NyaySetu-க்கு வரவேற்கிறோம்', auth_sub: 'உங்கள் பணியை சேமிக்க உள்நுழைக',
    disclaimer: 'NyaySetu AI-உருவாக்கிய சட்ட தகவல்களை வழங்குகிறது, சட்ட ஆலோசனை அல்ல.',
  },
  te: {
    nav_chat: 'AI చాట్', nav_docs: 'పత్రాలు', nav_simplify: 'సరళీకరణ',
    nav_students: 'విద్యార్థులు', nav_dashboard: 'డాష్‌బోర్డ్',
    hero_eyebrow: '⚡ భారతదేశం కోసం AI న్యాయ సహాయం',
    hero_title_1: 'మీ న్యాయ హక్కులు,', hero_title_2: 'మీ భాషలో',
    hero_subtitle: 'న్యాయ ప్రశ్నలు అడగండి, పత్రాలు రూపొందించండి. ఉచితం.',
    hero_cta: 'ఉచిత చాట్ ప్రారంభించు', hero_cta2: 'పత్రం రూపొందించు',
    stat1: 'భారత చట్టాలు', stat2: 'భాషలు', stat3: 'పత్రం రకాలు',
    feat1_title: 'AI న్యాయ చాట్‌బాట్', feat1_desc: 'సాధారణ భాషలో న్యాయ ప్రశ్నలు అడగండి.',
    feat2_title: 'పత్రం జెనరేటర్', feat2_desc: 'న్యాయ నోటీసులు, అఫిడవిట్లు మరియు RTI దరఖాస్తులు.',
    feat3_title: 'చట్టం సరళీకరణ', feat3_desc: 'న్యాయ వచనాన్ని సరళంగా వివరించండి.',
    feat4_title: 'విద్యార్థి విభాగం', feat4_desc: 'న్యాయ గమనికలు మరియు కేసు సారాంశాలు.',
    auth_title: 'NyaySetu కి స్వాగతం', auth_sub: 'మీ పనిని సేవ్ చేయడానికి లాగిన్ అవ్వండి',
    disclaimer: 'NyaySetu AI-జనిత న్యాయ సమాచారాన్ని అందిస్తుంది, న్యాయ సలహా కాదు.',
  },
  bn: {
    nav_chat: 'AI চ্যাট', nav_docs: 'নথি', nav_simplify: 'সরলীকরণ',
    nav_students: 'ছাত্র', nav_dashboard: 'ড্যাশবোর্ড',
    hero_eyebrow: '⚡ ভারতের জন্য AI আইনি সহায়তা',
    hero_title_1: 'আপনার আইনি অধিকার,', hero_title_2: 'আপনার ভাষায়',
    hero_subtitle: 'আইনি প্রশ্ন জিজ্ঞাসা করুন, নথি তৈরি করুন। বিনামূল্যে।',
    hero_cta: 'বিনামূল্যে চ্যাট শুরু করুন', hero_cta2: 'নথি তৈরি করুন',
    stat1: 'ভারতীয় আইন', stat2: 'ভাষা', stat3: 'নথির ধরন',
    feat1_title: 'AI আইনি চ্যাটবট', feat1_desc: 'সহজ ভাষায় আইনি প্রশ্ন জিজ্ঞাসা করুন।',
    feat2_title: 'নথি জেনারেটর', feat2_desc: 'আইনি নোটিশ, হলফনামা এবং RTI আবেদন।',
    feat3_title: 'আইন সরলীকারক', feat3_desc: 'জটিল আইনি পাঠ্য সহজ ভাষায় বুঝুন।',
    feat4_title: 'ছাত্র বিভাগ', feat4_desc: 'আইনি নোট এবং মামলার সারাংশ।',
    auth_title: 'NyaySetu-তে স্বাগতম', auth_sub: 'আপনার কাজ সংরক্ষণ করতে লগইন করুন',
    disclaimer: 'NyaySetu AI-উৎপন্ন আইনি তথ্য প্রদান করে, আইনি পরামর্শ নয়।',
  },
  mr: {
    nav_chat: 'AI चॅट', nav_docs: 'कागदपत्रे', nav_simplify: 'सरलीकरण',
    nav_students: 'विद्यार्थी', nav_dashboard: 'डॅशबोर्ड',
    hero_eyebrow: '⚡ भारतासाठी AI कायदेशीर सहाय्य',
    hero_title_1: 'तुमचे कायदेशीर हक्क,', hero_title_2: 'तुमच्या भाषेत',
    hero_subtitle: 'कायदेशीर प्रश्न विचारा, कागदपत्रे तयार करा. मोफत.',
    hero_cta: 'मोफत चॅट सुरू करा', hero_cta2: 'कागदपत्र तयार करा',
    stat1: 'भारतीय कायदे', stat2: 'भाषा', stat3: 'कागदपत्र प्रकार',
    feat1_title: 'AI कायदेशीर चॅटबॉट', feat1_desc: 'साध्या भाषेत कायदेशीर प्रश्न विचारा.',
    feat2_title: 'दस्तऐवज जनरेटर', feat2_desc: 'कायदेशीर नोटीस, शपथपत्र आणि RTI अर्ज.',
    feat3_title: 'कायदा सरलीकरण', feat3_desc: 'जटिल कायदेशीर मजकूर सोप्या भाषेत समजून घ्या.',
    feat4_title: 'विद्यार्थी विभाग', feat4_desc: 'कायदेशीर नोट्स आणि प्रकरण सारांश.',
    auth_title: 'NyaySetu मध्ये स्वागत आहे', auth_sub: 'तुमचे काम जतन करण्यासाठी लॉगिन करा',
    disclaimer: 'NyaySetu AI-निर्मित कायदेशीर माहिती प्रदान करते, कायदेशीर सल्ला नाही.',
  }
};

// ── App State ─────────────────────────────────────────────────
window.App = {
  lang: localStorage.getItem('nyaysetu_lang') || 'en',
  theme: localStorage.getItem('nyaysetu_theme') || 'dark',
  user: JSON.parse(localStorage.getItem('nyaysetu_user') || 'null'),
  stats: JSON.parse(localStorage.getItem('nyaysetu_stats') || '{"chats":0,"docs":0,"saved":0}'),
  activity: JSON.parse(localStorage.getItem('nyaysetu_activity') || '[]'),

  saveStats() { localStorage.setItem('nyaysetu_stats', JSON.stringify(this.stats)); },
  saveActivity() { localStorage.setItem('nyaysetu_activity', JSON.stringify(this.activity.slice(0, 50))); },
  addActivity(type, title) {
    this.activity.unshift({ type, title, time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) });
    this.saveActivity();
  }
};

// ── i18n ──────────────────────────────────────────────────────
function t(key) {
  const lang = App.lang;
  return (I18N[lang] && I18N[lang][key]) ? I18N[lang][key] : (I18N.en[key] || key);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.placeholder = val;
  });
}

function setLanguage(lang) {
  App.lang = lang;
  localStorage.setItem('nyaysetu_lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
  showToast(lang === 'en' ? 'Language updated' : 'भाषा बदली / Language updated', 'info');
}

// ── Theme ─────────────────────────────────────────────────────
function applyTheme(theme) {
  App.theme = theme;
  document.body.classList.toggle('light', theme === 'light');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('nyaysetu_theme', theme);
}

function toggleTheme() {
  applyTheme(App.theme === 'dark' ? 'light' : 'dark');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: '⚡' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '⚡'}</span><span>${escHtml(message)}</span>`;
  toast.onclick = () => dismissToast(toast);
  container.appendChild(toast);
  const timer = setTimeout(() => dismissToast(toast), duration);
  toast._timer = timer;
}

function dismissToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.add('out');
  setTimeout(() => toast.remove(), 300);
}

// ── Helpers ───────────────────────────────────────────────────
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTimeStr() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getDateStr() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!', 'success');
  });
}

// ── API Call ──────────────────────────────────────────────────
async function callClaude(messages, systemPrompt, maxTokens = 1000) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'API Error');
  return data.content.map(b => b.text || '').join('');
}

// ── Navigation highlight ──────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

// ── Hamburger menu ────────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// ── User auth state ───────────────────────────────────────────
function updateAuthUI() {
  const btn = document.getElementById('authNavBtn');
  if (!btn) return;
  if (App.user) {
    btn.textContent = '👤';
    btn.title = App.user.name;
    btn.onclick = () => { window.location.href = 'pages/dashboard.html'; };
  } else {
    btn.textContent = '👤';
    btn.title = 'Login';
    btn.onclick = () => { window.location.href = 'pages/auth.html'; };
  }
}

// ── Loading screen ────────────────────────────────────────────
function hideLoadingScreen() {
  const ls = document.getElementById('loading-screen');
  if (ls) {
    setTimeout(() => {
      ls.style.opacity = '0';
      setTimeout(() => ls.remove(), 500);
    }, 800);
  }
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(App.theme);
  applyTranslations();
  setActiveNav();
  initHamburger();
  updateAuthUI();
  hideLoadingScreen();

  const langSel = document.getElementById('langSelect');
  if (langSel) {
    langSel.value = App.lang;
    langSel.addEventListener('change', e => setLanguage(e.target.value));
  }

  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});
