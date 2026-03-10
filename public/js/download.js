import { state } from './state.js';
import { downloadBtn } from './dom.js';

export function initDownload() {
  downloadBtn.addEventListener('click', () => {
    if (!state.batchId) return;
    window.location.href = `/api/download/${state.batchId}`;
  });

  window.addEventListener('beforeunload', () => {
    if (state.batchId) {
      navigator.sendBeacon(`/api/cleanup/${state.batchId}`);
    }
  });
}
