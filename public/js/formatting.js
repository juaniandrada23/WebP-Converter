import { progressFill } from './dom.js';

export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0) + ' ' + sizes[i];
}

export function setProgress(pct) {
  progressFill.style.width = pct + '%';
  progressFill.setAttribute('aria-valuenow', Math.round(pct));
}

export function getSavingsClass(savings) {
  const n = parseFloat(savings);
  if (n >= 40) return 'savings-high';
  if (n >= 15) return 'savings-medium';
  if (n >= 0) return 'savings-low';
  return 'savings-negative';
}

export function truncate(str, max) {
  if (str.length <= max) return str;
  const ext = str.lastIndexOf('.');
  if (ext > 0 && str.length - ext < 8) {
    const name = str.slice(0, ext);
    const extension = str.slice(ext);
    const available = max - extension.length - 3;
    return name.slice(0, available) + '...' + extension;
  }
  return str.slice(0, max - 3) + '...';
}
