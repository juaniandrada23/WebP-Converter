import { state } from './state.js';
import { downloadBtn } from './dom.js';

export function initDownload() {
  let downloading = false;

  downloadBtn.addEventListener('click', () => {
    if (!state.batchId) return;
    downloading = true;
    window.location.href = `/api/download/${state.batchId}`;
    setTimeout(() => { downloading = false; }, 3000);
  });

  window.addEventListener('beforeunload', () => {
    if (state.batchId && !downloading) {
      navigator.sendBeacon(`/api/cleanup/${state.batchId}`);
    }
  });
}
