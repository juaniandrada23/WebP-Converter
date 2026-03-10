import { state } from './state.js';
import { previewGrid } from './dom.js';
import { escapeHTML, formatBytes } from './formatting.js';

export function renderPreviews() {
  previewGrid.innerHTML = '';
  for (const file of state.localFiles) {
    const card = document.createElement('div');
    card.className = 'preview-card';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.onload = () => URL.revokeObjectURL(img.src);
    img.onerror = () => URL.revokeObjectURL(img.src);

    const info = document.createElement('div');
    info.className = 'preview-info';
    info.innerHTML = `
      <div class="preview-name" title="${escapeHTML(file.name)}">${escapeHTML(file.name)}</div>
      <div class="preview-size">${formatBytes(file.size)}</div>
    `;

    card.appendChild(img);
    card.appendChild(info);
    previewGrid.appendChild(card);
  }
}
