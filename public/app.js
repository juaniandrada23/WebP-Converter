import { initI18n, applyTranslations } from './js/i18n/i18n.js';
import { initDropzone } from './js/dropzone.js';
import { initPresets } from './js/presets.js';
import { initDownload } from './js/download.js';
import { startConversion } from './js/conversion.js';
import { convertBtn } from './js/dom.js';

initI18n();
initDropzone();
initPresets();
initDownload();
convertBtn.addEventListener('click', startConversion);

fetch('/api/config')
  .then((res) => res.json())
  .then((config) => {
    const maxMB = Math.round(config.maxFileSize / (1024 * 1024));
    const formatsEl = document.querySelector('.dropzone-formats');
    if (formatsEl) {
      formatsEl.setAttribute('data-i18n-vars', JSON.stringify({ maxMB: maxMB + ' MB' }));
      applyTranslations();
    }
  })
  .catch(() => {});
