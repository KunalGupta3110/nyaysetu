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

// Store original English text for elements so we can fall back easily
// and avoid re-translating translated text on subsequent language changes.
const originalTextMap = new WeakMap();
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

function getElementOriginalText(el) {
  let originalText = originalTextMap.get(el);
  if (originalText) {
    const cleaned = cleanTranslationText(originalText);
    if (cleaned !== originalText) originalTextMap.set(el, cleaned);
    return cleaned;
  }

  if (el.hasAttribute('data-i18n-placeholder')) {
    originalText = el.placeholder;
  } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    originalText = el.placeholder;
  } else {
    const text = el.innerText || el.textContent || '';
    originalText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }

  originalText = cleanTranslationText(originalText);
  if (originalText) originalTextMap.set(el, originalText);
  return originalText || '';
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
    el.innerHTML = escapeI18nHTML(cleaned);
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
