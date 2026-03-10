import en from './en.js';
import es from './es.js';

const translations = { en, es };
let currentLang = 'en';

function resolve(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{{${k}}}`));
}

export function t(key, vars) {
  const val = resolve(translations[currentLang], key) ?? resolve(translations.en, key) ?? key;
  return interpolate(val, vars);
}

export function getCurrentLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function applyTranslations() {
  document.documentElement.lang = currentLang;

  // textContent
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.getAttribute('data-i18n');
    const vars = el.getAttribute('data-i18n-vars');
    el.textContent = t(key, vars ? JSON.parse(vars) : undefined);
  }

  // innerHTML (for strings with HTML entities)
  for (const el of document.querySelectorAll('[data-i18n-html]')) {
    const key = el.getAttribute('data-i18n-html');
    const vars = el.getAttribute('data-i18n-vars');
    el.innerHTML = t(key, vars ? JSON.parse(vars) : undefined);
  }

  // attributes (format: "attr1:key1;attr2:key2")
  for (const el of document.querySelectorAll('[data-i18n-attr]')) {
    const pairs = el.getAttribute('data-i18n-attr').split(';');
    for (const pair of pairs) {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    }
  }

  // meta tags
  document.title = t('meta.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', t('meta.ogTitle'));
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', t('meta.ogDescription'));

  // update toggle active state
  for (const btn of document.querySelectorAll('.lang-btn')) {
    const isActive = btn.getAttribute('data-lang') === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  }
}

export function translateError(errData) {
  if (errData && errData.errorCode) {
    return t('errors.' + errData.errorCode, errData.errorParams);
  }
  return errData && errData.error ? errData.error : String(errData);
}

export function initI18n() {
  const saved = localStorage.getItem('lang');
  if (saved && translations[saved]) {
    currentLang = saved;
  } else {
    const navLang = (navigator.language || '').slice(0, 2).toLowerCase();
    currentLang = translations[navLang] ? navLang : 'en';
  }

  applyTranslations();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang) setLang(lang);
  });
}
