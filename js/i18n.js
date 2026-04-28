/*
   NYAYSETU - OPTIMIZED MULTILINGUAL UI
   Features: Fast caching, unique text extraction, batch processing fallback, loading UX.
*/

window.LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi - हिन्दी',
  bn: 'Bengali - বাংলা',
  te: 'Telugu - తెలుగు',
  mr: 'Marathi - मराठी',
  ta: 'Tamil - தமிழ்',
  ur: 'Urdu - اردو',
  gu: 'Gujarati - ગુજરાતી',
  kn: 'Kannada - ಕನ್ನಡ',
  ml: 'Malayalam - മലയാളം',
  or: 'Odia - ଓଡ଼ିଆ',
  pa: 'Punjabi - ਪੰਜਾਬੀ',
  as: 'Assamese - অসমীয়া',
  mai: 'Maithili - मैथिली',
  sat: 'Santali - ᱥᱟᱱᱛᱟᱲᱤ',
  ks: 'Kashmiri - کٲشُر',
  ne: 'Nepali - नेपाली',
  sd: 'Sindhi - سنڌي',
  kok: 'Konkani - कोंकणी',
  doi: 'Dogri - डोगरी',
  mni: 'Manipuri - মৈতৈলোন্',
  brx: 'Bodo - बड़ो',
  sa: 'Sanskrit - संस्कृतम्',
  bho: 'Bhojpuri - भोजपुरी',
  raj: 'Rajasthani - राजस्थानी',
  bgc: 'Haryanvi - हरियाणवी',
  hne: 'Chhattisgarhi - छत्तीसगढ़ी',
  mag: 'Magahi - मगही',
  awa: 'Awadhi - अवधी',
  tcy: 'Tulu - ತುಳು',
  kha: 'Khasi - Khasi',
  grt: 'Garo - A.chik',
  lus: 'Mizo - Mizo',
  nag: 'Nagamese - Nagamese',
  lep: 'Lepcha - ᰛᰩᰵᰛᰧᰶ',
  lbj: 'Ladakhi - ལ་དྭགས་སྐད',
  bhb: 'Bhili - भीली',
  gon: 'Gondi - गोंडी',
  hoc: 'Ho - 𑢹𑣉',
  kru: 'Kurukh - कुड़ुख़',
  unr: 'Mundari - मुंडारी'
};

const DEFAULT_LOCALE = 'en';
const TRANSLATION_API_URL = 'https://translate.googleapis.com/translate_a/single';
const BASE_TEXT = {
  page_title: 'NyaySetu - AI-Powered Legal Access for India',
  home_page_title: 'NyaySetu - AI-Powered Legal Access for India',
  chat_page_title: 'AI Chat - NyaySetu',
  docs_page_title: 'Document Generator - NyaySetu',
  simplify_page_title: 'Law Simplifier - NyaySetu',
  students_page_title: 'Student Ecosystem - NyaySetu',
  auth_page_title: 'Sign In - NyaySetu',
  dash_page_title: 'Dashboard - NyaySetu',
  nav_home: 'Home',
  nav_chat: 'AI Chat',
  nav_docs: 'Documents',
  nav_simplify: 'Simplifier',
  nav_students: 'Students',
  nav_dashboard: 'Dashboard',
  nav_ask: 'Ask a Question',
  hero_badge: 'AI-Powered - Legal Access - India',
  hero_title: 'Justice should not depend on who you know.',
  hero_sub: 'NyaySetu bridges the gap between people and the law. Ask legal questions in plain language - English, Hindi, Urdu, or any Indian language - powered by AI, reviewed by law students and professionals.',
  hero_start: 'Start for Free ->',
  hero_how: 'How It Works',
  hero_note: 'No signup required - Hindi, Urdu and more Indian languages - 12,400+ queries resolved',
  metric_queries: 'Legal queries resolved',
  metric_students: 'Law students onboarded',
  metric_docs: 'Documents generated',
  metric_satisfaction: 'User satisfaction',
  process_title: 'Process',
  process_header: 'A system built for clarity',
  process_sub: 'Every query passes through AI analysis and human review - fast and reliable.',
  process_step1_title: 'You Ask',
  process_step1_desc: 'Submit your legal question in English, Hindi, Urdu, or any Indian language. No legal knowledge needed.',
  process_step2_title: 'AI Analyses',
  process_step2_desc: 'Legal AI identifies applicable laws, IPC sections, and precedents instantly.',
  process_step3_title: 'Student Reviews',
  process_step3_desc: 'A verified law student reviews the output and adds professional context.',
  process_step4_title: 'Lawyer Escalates',
  process_step4_desc: 'Complex cases routed to licensed advocates - faster and affordable.',
  tag_citizen: 'Citizen',
  tag_ai: 'NyaySetu AI',
  tag_law_student: 'Law Student',
  tag_advocate: 'Advocate',
  features_title: 'Capabilities',
  features_sub: 'Every legal need, covered',
  feat_ai_title: 'AI Legal Assistant',
  feat_ai_desc: 'Ask anything in plain language - FIR procedures, property disputes, consumer rights. AI identifies applicable laws in seconds.',
  feat_ai_action: 'Open Chat',
  feat_docs_title: 'Document Generator',
  feat_docs_desc: 'Generate legally accurate documents in minutes - legal notices, affidavits, rent agreements, consumer complaints, RTI applications.',
  feat_docs_action: 'Generate Now',
  feat_simplify_title: 'Law Simplifier',
  feat_simplify_desc: 'Paste any legal text - court order, notice, contract, government circular - get a plain language breakdown with actionable steps.',
  feat_simplify_action: 'Try Simplifier',
  feat_students_title: 'Student Ecosystem',
  feat_students_desc: "Law students earn credits reviewing queries, build real portfolios, and get ranked on India's legal AI professional leaderboard.",
  feat_students_action: 'Join as Student',
  advantage_label: 'Advantage',
  advantage_title: 'Why NyaySetu exists',
  advantage_sub: 'Traditional legal help is slow, expensive, and inaccessible. We built NyaySetu to change all three.',
  why_fast_title: 'Fast - minutes, not weeks',
  why_fast_desc: 'Traditional legal consultation can take days to begin. NyaySetu provides an intelligent first response in under 30 seconds, with a reviewed answer within hours.',
  why_fast_metric: '< 30 second initial response',
  why_affordable_title: 'Affordable - not Rs.5,000/hour',
  why_affordable_desc: 'Legal help in India is prohibitively expensive. NyaySetu is free to start - and premium plans cost less than a single traditional consultation.',
  why_affordable_metric: 'Fraction of traditional cost',
  why_access_title: 'Accessible - anywhere, anyone',
  why_access_desc: "Whether you're in Delhi or a small town in Bihar - if you have a phone, you have access to legal guidance. No office visits, no appointments.",
  why_access_metric: 'Any device, any location',
  cta_title: 'Get Started Today',
  cta_header: 'Your rights matter. Know them.',
  cta_sub: 'Ask your first legal question for free. No signup required to begin.',
  cta_button: 'Start for Free ->',
  cta_note: 'No credit card required - Hindi and English - 12,400+ queries resolved',
  footer_privacy: 'Privacy Policy',
  footer_terms: 'Terms of Use',
  footer_disclaimer: 'Legal Disclaimer',
  footer_contact: 'Contact Us',
  footer_copy: '(c) 2025 NyaySetu - Not a substitute for legal advice',
  chat_welcome_heading: 'How can NyaySetu help?',
  chat_welcome_sub: 'Ask any legal question in English, Hindi, Urdu, or any Indian language. Our AI will analyse your situation, identify relevant laws, and provide actionable guidance.',
  chat_placeholder: 'Ask your legal question here...',
  chat_new: 'New Chat',
  chat_doc_link: 'Generate Document',
  chat_simplify_link: 'Simplify a Law',
  chat_disclaimer: 'NyaySetu provides legal guidance, not professional legal advice. For serious matters, consult a qualified advocate.',
  chat_name: 'NyaySetu Legal AI',
  chat_online: 'Online - Reviewed by law professionals',
  chat_hint: 'Enter to send - Shift+Enter for new line',
  sidebar_topics: 'Topics',
  docs_title: 'Document Generator',
  docs_header: 'Generate legal documents in minutes',
  docs_sub: 'AI-powered, legally accurate templates for every common Indian legal need. Fill in your details - ready to use in under 60 seconds.',
  docs_gen_button: 'Generate Document',
  docs_preview_title: 'Document Preview',
  docs_preview_placeholder: 'Fill in the form on the left and click <strong style="color:var(--accent)">"Generate Document"</strong>',
  docs_copy: 'Copy',
  docs_download: 'Download PDF',
  simplifier_title: 'Law Simplifier',
  simplifier_header: 'Understand any legal text instantly',
  simplifier_sub: 'Paste a court order, legal notice, contract clause, IPC section, or government circular - get a plain-language breakdown with actionable steps in seconds.',
  simplifier_try_sample: 'Try a sample:',
  simplify_input_label: 'Legal Text Input',
  simplify_input_badge: 'Paste Here',
  simplify_clear: 'Clear',
  simplify_button: 'Simplify ->',
  simplify_output_label: 'Plain English',
  simplify_output_badge: 'Simplified',
  simplifier_output_placeholder: 'Your plain-language explanation will appear here',
  students_title: 'Student Ecosystem',
  students_header: 'Learn by doing. Earn while practicing.',
  students_sub: "Review real legal queries, build a professional portfolio, and get ranked on India's premier legal AI platform.",
  students_tab_dashboard: 'Dashboard',
  students_tab_review: 'Review Queue',
  students_tab_leaderboard: 'Leaderboard',
  students_tab_signup: 'Join as Student',
  auth_brand_title: 'Your legal rights, one login away.',
  auth_brand_sub: 'Access AI-powered legal guidance, generate documents, and get answers reviewed by law professionals.',
  auth_feature_chat: 'AI legal chat with real law references',
  auth_feature_docs: 'Generate legal documents in minutes',
  auth_feature_simplify: 'Simplify any legal text instantly',
  auth_feature_private: 'Your data is private and secure',
  auth_terms: 'By signing in, you agree to our <a href="terms.html" style="color:var(--accent)">Terms of Service</a>. NyaySetu is not a law firm. AI guidance is not legal advice.',
  auth_google: 'Continue with Google',
  auth_email_continue: 'or continue with email',
  auth_tab_signin: 'Sign In',
  auth_tab_signup: 'Create Account',
  auth_signin_title: 'Welcome back',
  auth_signin_sub: 'Sign in to your NyaySetu account.',
  auth_email_label: 'Email Address',
  auth_email_placeholder: 'Enter your email',
  auth_password_label: 'Password',
  auth_password_placeholder: 'Enter your password',
  auth_forgot_password: 'Forgot password?',
  auth_signin_button: 'Sign In ->',
  auth_no_account: 'Don\'t have an account? <a href="#" onclick="switchTab(\'signup\')">Create one free</a>',
  auth_signup_title: 'Create your account',
  auth_signup_sub: 'Free forever. No credit card required.',
  auth_role_label: 'I am a',
  auth_role_citizen: 'Citizen',
  auth_role_citizen_desc: 'Seeking legal help',
  auth_role_student: 'Law Student',
  auth_role_student_desc: 'Want to review and earn',
  auth_fullname_placeholder: 'Your full name',
  auth_city_placeholder: 'Your city',
  auth_password_hint: 'Create a password',
  auth_college_placeholder: 'Your law college',
  auth_area_label: 'Area of Interest',
  auth_select_area: 'Select area',
  auth_area_criminal: 'Criminal Law',
  auth_area_civil: 'Civil / Property Law',
  auth_area_family: 'Family Law',
  auth_area_consumer: 'Consumer Law',
  auth_area_constitutional: 'Constitutional Law',
  auth_area_all: 'All Areas',
  auth_create_button: 'Create Account ->',
  auth_already_account: 'Already have an account? <a href="#" onclick="switchTab(\'signin\')">Sign in</a>',
  auth_reset_title: 'Reset password',
  auth_reset_sub: 'Enter your email and we will send a reset link.',
  auth_send_reset: 'Send Reset Link',
  auth_back_to_signin: 'Back to sign in',
  dash_menu_profile: 'Profile Settings',
  dash_menu_docs: 'My Documents',
  dash_menu_students: 'Student Dashboard',
  dash_menu_signout: 'Sign Out',
  dash_no_chats_title: 'No conversations yet',
  dash_no_chats_sub: 'Your AI chat history will appear here',
  dash_start_chatting: 'Start Chatting ->',
  dash_no_docs_title: 'No documents yet',
  dash_no_docs_sub: 'Generate your first legal document',
  dash_generate_doc: 'Generate Document ->',
  dash_snav_main: 'Main',
  dash_snav_overview: 'Overview',
  dash_snav_chats: 'Chat History',
  dash_snav_docs: 'My Documents',
  dash_snav_simplify: 'Simplify History',
  dash_snav_account: 'Account',
  dash_snav_profile: 'Profile',
  dash_snav_signout: 'Sign Out',
  dash_welcome_title: 'Good day, <span id="wb-name">there</span>',
  dash_welcome_sub: 'Here is a summary of your NyaySetu activity.',
  dash_btn_ask: 'Ask a Legal Question',
  dash_btn_generate: 'Generate Document',
  dash_stat_chats: 'Chat Sessions',
  dash_stat_docs: 'Documents Saved',
  dash_stat_simplified: 'Laws Simplified',
  dash_stat_resolution: 'Query Resolution',
  dash_recent_convos: 'Recent Conversations'
};

const memoryTranslationCache = new Map();
const pendingTranslationRequests = new Map();
let activeTranslationRun = 0;

function getTranslationCacheKey(lang, text) {
  return `${lang}_${cleanTranslationText(text)}`;
}

function readCachedTranslation(lang, text) {
  const cacheKey = getTranslationCacheKey(lang, text);
  if (memoryTranslationCache.has(cacheKey)) {
    const cleaned = cleanTranslationText(memoryTranslationCache.get(cacheKey));
    memoryTranslationCache.set(cacheKey, cleaned);
    return cleaned;
  }

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached !== null) {
      const cleaned = cleanTranslationText(cached);
      memoryTranslationCache.set(cacheKey, cleaned);
      if (cleaned !== cached) localStorage.setItem(cacheKey, cleaned);
      return cleaned;
    }
  } catch (err) {
    // localStorage can fail in private mode or when quota is full. Fall back cleanly.
  }

  return null;
}

function writeCachedTranslation(lang, text, translatedText) {
  const cacheKey = getTranslationCacheKey(lang, text);
  const cleaned = cleanTranslationText(translatedText);
  memoryTranslationCache.set(cacheKey, cleaned);

  try {
    localStorage.setItem(cacheKey, cleaned);
  } catch (err) {
    // Keep the in-memory cache even if persistent storage is unavailable.
  }
}

function getRequestedLanguage(lang) {
  return typeof lang === 'string' && LANGUAGE_NAMES[lang] ? lang : getSavedLanguage();
}

function getElementI18nKey(el) {
  return el.getAttribute('data-i18n-placeholder') ||
    el.getAttribute('data-i18n-html') ||
    el.getAttribute('data-i18n') ||
    '';
}

function getElementOriginalText(el) {
  const key = getElementI18nKey(el);
  if (!key) return '';

  const originalText = BASE_TEXT[key];
  if (originalText === undefined) {
    console.warn(`Missing BASE_TEXT entry for i18n key "${key}"`);
    return cleanTranslationText(key);
  }

  return cleanTranslationText(originalText);
}

function cleanTranslationText(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\r\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeI18nHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setElementText(el, value) {
  const cleaned = cleanTranslationText(value);

  if (el.hasAttribute('data-i18n-placeholder')) {
    el.placeholder = cleaned;
  } else if (el.hasAttribute('data-i18n-html')) {
    el.innerHTML = cleaned;
  } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    el.placeholder = cleaned;
  } else {
    el.textContent = cleaned;
  }
}

function setTranslationLoading(isLoading) {
  if (!document.body) return;
  document.body.style.transition = 'opacity 0.2s ease';
  document.body.style.opacity = isLoading ? '0.65' : '1';
}

/**
 * 1. CORE TRANSLATION & CACHING FUNCTION
 * - Checks localStorage cache first
 * - If missing, calls API
 * - Saves result to cache
 */
async function translateText(text, lang) {
  const targetLang = getRequestedLanguage(lang);
  const sourceText = cleanTranslationText(text);
  if (!sourceText || targetLang === DEFAULT_LOCALE) return sourceText;

  const cached = readCachedTranslation(targetLang, sourceText);
  if (cached !== null) return cached;

  const requestKey = getTranslationCacheKey(targetLang, sourceText);
  if (pendingTranslationRequests.has(requestKey)) {
    return pendingTranslationRequests.get(requestKey);
  }

  const request = (async () => {
    try {
      const url = `${TRANSLATION_API_URL}?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(sourceText)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Translation API failed');

      const data = await response.json();
      const translatedText = Array.isArray(data?.[0])
        ? data[0].map(part => part?.[0] || '').join('')
        : sourceText;

      const cleaned = cleanTranslationText(translatedText || sourceText);
      writeCachedTranslation(targetLang, sourceText, cleaned);
      return cleaned;
    } catch (error) {
      console.warn(`Translation failed for "${sourceText}"`, error);
      return sourceText;
    } finally {
      pendingTranslationRequests.delete(requestKey);
    }
  })();

  pendingTranslationRequests.set(requestKey, request);
  return request;
}

/**
 * 2. OPTIMIZED TRANSLATION LOOP
 * - Collects unique texts
 * - Pre-translates only what's needed
 * - Updates DOM in one go
 */
async function applyTranslations(lang) {
  const targetLang = getRequestedLanguage(lang);
  const runId = ++activeTranslationRun;
  const elements = Array.from(document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder]'));
  const uniqueTexts = new Set();

  elements.forEach(el => {
    const originalText = getElementOriginalText(el);
    if (originalText && targetLang !== DEFAULT_LOCALE) uniqueTexts.add(originalText);
  });

  document.documentElement.lang = targetLang;
  document.documentElement.dir = ['ur', 'sd', 'ks'].includes(targetLang) ? 'rtl' : 'ltr';

  if (targetLang === DEFAULT_LOCALE) {
    elements.forEach(el => {
      const originalText = getElementOriginalText(el);
      if (originalText) setElementText(el, originalText);
    });
    setTranslationLoading(false);
    return;
  }

  const translationMap = new Map();
  const missingTexts = [];

  uniqueTexts.forEach(text => {
    const cached = readCachedTranslation(targetLang, text);
    if (cached !== null) translationMap.set(text, cached);
    else missingTexts.push(text);
  });

  if (missingTexts.length > 0) setTranslationLoading(true);

  try {
    await Promise.all(missingTexts.map(async text => {
      const translated = await translateText(text, targetLang);
      translationMap.set(text, translated || text);
    }));

    if (runId !== activeTranslationRun) return;

    elements.forEach(el => {
      const originalText = getElementOriginalText(el);
      if (!originalText) return;
      setElementText(el, translationMap.get(originalText) || originalText);
    });
  } finally {
    if (runId === activeTranslationRun) setTranslationLoading(false);
  }
}

/**
 * 3. UI HELPERS & INITIALIZATION
 */
function getSavedLanguage() {
  const saved = localStorage.getItem('lang');
  if (saved && LANGUAGE_NAMES[saved]) return saved;
  const browserLang = navigator.language?.split('-')[0];
  return LANGUAGE_NAMES[browserLang] ? browserLang : DEFAULT_LOCALE;
}

function getLangSelectHTML() {
  return `<select class="lang-select" id="lang-select" aria-label="Select language" onchange="changeLanguage(this.value)">` +
    Object.entries(LANGUAGE_NAMES).map(([code, label]) =>
      `<option value="${code}">${label}</option>`
    ).join('') +
    `</select>`;
}

async function changeLanguage(lang) {
  const targetLang = getRequestedLanguage(lang);

  // Save selected language
  localStorage.setItem('lang', targetLang);
  if (typeof window.onLanguageChange === 'function') window.onLanguageChange(targetLang);
  
  // Update dropdowns if multiple exist
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = targetLang;
  });
  
  // Apply translation
  await applyTranslations(targetLang);
}

function initI18n() {
  // Render dropdown in nav if empty
  document.querySelectorAll('.nav-lang').forEach(slot => {
    if (!slot.querySelector('#lang-select')) {
      slot.innerHTML = getLangSelectHTML();
    }
  });
  
  const savedLang = getSavedLanguage();
  
  // Set select elements to correct value
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = savedLang;
  });
  
  // Apply language on load if it's not default
  if (savedLang !== DEFAULT_LOCALE) {
    applyTranslations(savedLang);
  }
}

// Export for global usage
window.getLangSelectHTML = getLangSelectHTML;
window.changeLanguage = changeLanguage;
window.translateText = translateText;
window.applyTranslations = applyTranslations;
window.initI18n = initI18n;

// Boot immediately on load
setTimeout(() => initI18n(), 0);
