import { state } from './state.js';
import { $, resultsSection, resultsBody, resultsCards, progressText } from './dom.js';
import { escapeHTML, formatBytes, truncate, getSavingsClass } from './formatting.js';
import { t } from './i18n/i18n.js';

export function addResultRow(result) {
  const serverFile = state.files.find((f) => f.id === result.id);
  const displayName = serverFile ? serverFile.originalName : result.outputName;

  const safeName = escapeHTML(truncate(displayName, 30));
  const safeFullName = escapeHTML(displayName);

  addTableRow(result, safeName, safeFullName);
  addCard(result, safeName, safeFullName);
}

function addTableRow(result, safeName, safeFullName) {
  const tr = document.createElement('tr');

  if (result.status === 'error') {
    tr.innerHTML = `
      <td title="${safeFullName}">${safeName}</td>
      <td>&mdash;</td>
      <td>&mdash;</td>
      <td>&mdash;</td>
      <td class="status-error" title="${escapeHTML(result.error || '')}">${t('results.statusError')}</td>
    `;
  } else {
    const savingsClass = getSavingsClass(result.savings);
    tr.innerHTML = `
      <td title="${safeFullName}">${safeName}</td>
      <td>${formatBytes(result.originalSize)}</td>
      <td>${formatBytes(result.convertedSize)}</td>
      <td><span class="savings-badge ${savingsClass}">${result.savings}%</span></td>
      <td class="status-success">${t('results.statusDone')}</td>
    `;
  }

  resultsBody.appendChild(tr);
}

function addCard(result, safeName, safeFullName) {
  const card = document.createElement('div');
  card.className = 'result-card' + (result.status === 'error' ? ' is-error' : '');

  if (result.status === 'error') {
    card.innerHTML = `
      <div class="result-card-name" title="${safeFullName}">${safeName}</div>
      <div class="result-card-status"><span class="status-error">${t('results.statusError')}</span></div>
      <div class="result-card-meta">${escapeHTML(result.error || t('results.conversionFailed'))}</div>
    `;
  } else {
    const savingsClass = getSavingsClass(result.savings);
    card.innerHTML = `
      <div class="result-card-name" title="${safeFullName}">${safeName}</div>
      <div class="result-card-status"><span class="status-success">${t('results.statusDone')}</span></div>
      <div class="result-card-meta">
        ${formatBytes(result.originalSize)} &rarr; ${formatBytes(result.convertedSize)}
        <span class="savings-badge ${savingsClass}">${result.savings}%</span>
      </div>
    `;
  }

  resultsCards.appendChild(card);
}

export function showResults() {
  resultsSection.hidden = false;
  progressText.textContent = t('progress.done');

  const successResults = state.results.filter((r) => r.status === 'success');
  const totalOriginal = successResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalConverted = successResults.reduce((sum, r) => sum + r.convertedSize, 0);
  const totalSaved = totalOriginal > 0 ? ((1 - totalConverted / totalOriginal) * 100).toFixed(1) : 0;

  $('#summaryCount').textContent = successResults.length;
  $('#summaryOriginal').textContent = formatBytes(totalOriginal);
  $('#summaryWebp').textContent = formatBytes(totalConverted);
  $('#summarySaved').textContent = totalSaved + '%';
}

document.addEventListener('langchange', () => {
  if (state.results.length > 0) {
    resultsBody.innerHTML = '';
    resultsCards.innerHTML = '';
    for (const result of state.results) {
      addResultRow(result);
    }
    showResults();
  }
});
