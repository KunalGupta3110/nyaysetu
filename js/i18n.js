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

/**
 * 1. CORE TRANSLATION & CACHING FUNCTION
 * - Checks localStorage cache first
 * - If missing, calls API
 * - Saves result to cache
 */
async function translateText(text, lang) {
  if (!text || !text.trim() || lang === DEFAULT_LOCALE) return text;
  
  // Format: lang_text
  const cacheKey = `${lang}_${text}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    return cached; // Use immediately if exists
  }
  
  try {
    const url = `${TRANSLATION_API_URL}?client=gtx&sl=en&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    const translatedText = Array.isArray(data?.[0])
      ? data[0].map(part => part?.[0] || '').join('')
      : text;
      
    // Save to cache
    localStorage.setItem(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error(`Translation error for "${text}":`, error);
    return text; // Fallback safety: return original English text
  }
}

/**
 * 2. OPTIMIZED TRANSLATION LOOP
 * - Collects unique texts
 * - Pre-translates only what's needed
 * - Updates DOM in one go
 */
async function applyTranslations(lang) {
  // Show loading UX (reduce opacity)
  document.body.style.transition = 'opacity 0.3s ease';
  document.body.style.opacity = '0.5';

  const elements = document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder]');
  
  // Extract texts and remove duplicates
  const uniqueTexts = new Set();
  
  // First pass: extract originals safely
  elements.forEach(el => {
    let originalText = originalTextMap.get(el);
    
    if (!originalText) {
      if (el.hasAttribute('data-i18n-placeholder')) {
        originalText = el.placeholder;
      } else if (el.hasAttribute('data-i18n-html')) {
        originalText = el.innerHTML.trim();
      } else {
        originalText = (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') 
          ? el.placeholder 
          : el.textContent.trim();
      }
      
      if (originalText) {
        originalTextMap.set(el, originalText);
      }
    }
    
    if (originalText && lang !== DEFAULT_LOCALE) {
      uniqueTexts.add(originalText);
    }
  });

  // If defaulting to English, just restore and exit early
  if (lang === DEFAULT_LOCALE) {
    elements.forEach(el => {
      const originalText = originalTextMap.get(el);
      if (!originalText) return;
      
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.placeholder = originalText;
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = originalText;
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = originalText;
      } else {
        el.textContent = originalText;
      }
    });
    
    document.body.style.opacity = '1';
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    return;
  }

  // Pre-translate all unique texts in parallel
  const translationMap = new Map();
  const textArray = Array.from(uniqueTexts);
  
  // Wait for all unique strings to be translated (using cache where possible)
  const translationPromises = textArray.map(async text => {
    const translated = await translateText(text, lang);
    translationMap.set(text, translated);
  });
  
  await Promise.all(translationPromises);

  // Apply to UI
  elements.forEach(el => {
    const originalText = originalTextMap.get(el);
    if (!originalText) return;
    
    const newText = translationMap.get(originalText) || originalText;
    
    if (el.hasAttribute('data-i18n-placeholder')) {
      el.placeholder = newText;
    } else if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = newText;
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = newText;
    } else {
      el.textContent = newText;
    }
  });

  // Restore UI loading state
  document.body.style.opacity = '1';
  
  // Setup document meta
  document.documentElement.lang = lang;
  document.documentElement.dir = ['ur', 'sd', 'ks'].includes(lang) ? 'rtl' : 'ltr';
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
  // Save selected language
  localStorage.setItem('lang', lang);
  
  // Update dropdowns if multiple exist
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = lang;
  });
  
  // Apply translation
  await applyTranslations(lang);
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
