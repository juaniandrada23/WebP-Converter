import { state } from './state.js';
import { controls, convertBtn } from './dom.js';
import { renderPreviews } from './previews.js';
import { t, translateError } from './i18n/i18n.js';

let configCache = null;

async function getConfig() {
  if (configCache) return configCache;
  const res = await fetch('/api/config');
  configCache = await res.json();
  return configCache;
}

export async function handleFiles(files) {
  const config = await getConfig();
  const maxFileSize = config.maxFileSize;
  const maxFileCount = config.maxFileCount;
  const maxMB = Math.round(maxFileSize / (1024 * 1024));

  const oversized = files.filter((f) => f.size > maxFileSize);
  if (oversized.length > 0) {
    alert(t('upload.oversized', { count: oversized.length, maxMB: maxMB + ' MB' }));
    files = files.filter((f) => f.size <= maxFileSize);
    if (files.length === 0) return;
  }
  if (state.localFiles.length + files.length > maxFileCount) {
    const remaining = maxFileCount - state.localFiles.length;
    alert(t('upload.tooMany', { max: maxFileCount, remaining }));
    files = files.slice(0, remaining);
    if (files.length === 0) return;
  }

  state.localFiles = [...state.localFiles, ...files];
  renderPreviews();
  controls.hidden = false;

  convertBtn.disabled = true;
  convertBtn.textContent = t('convert.uploading');

  try {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    const headers = {};
    if (state.batchId) headers['X-Batch-Id'] = state.batchId;

    const res = await fetch('/api/upload', { method: 'POST', headers, body: formData });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(translateError(err));
    }

    const data = await res.json();
    state.batchId = data.batchId;
    state.files = [...state.files, ...data.files];

    convertBtn.disabled = false;
    convertBtn.textContent = t('convert.button');
  } catch (err) {
    alert(t('upload.error', { message: err.message }));
    convertBtn.disabled = false;
    convertBtn.textContent = t('convert.button');
  }
}
