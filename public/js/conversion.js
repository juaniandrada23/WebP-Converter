import { state } from './state.js';
import { convertBtn, progressSection, resultsSection, resultsBody, resultsCards, progressText, progressCount, progressFill } from './dom.js';
import { setProgress } from './formatting.js';
import { addResultRow, showResults } from './results.js';
import { t } from './i18n/i18n.js';

export async function startConversion() {
  if (!state.batchId || state.files.length === 0) return;

  convertBtn.disabled = true;
  convertBtn.textContent = t('convert.converting');
  progressSection.hidden = false;
  resultsSection.hidden = true;
  state.results = [];
  resultsBody.innerHTML = '';
  resultsCards.innerHTML = '';
  setProgress(0);
  progressFill.classList.add('active');

  try {
    await convertWithSSE();
  } catch {
    await convertWithPOST();
  }

  progressFill.classList.remove('active');
  convertBtn.disabled = false;
  convertBtn.textContent = t('convert.button');
}

function convertWithSSE() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      batchId: state.batchId,
      preset: state.preset,
    });
    const es = new EventSource(`/api/convert-stream?${params}`);
    let resolved = false;

    es.addEventListener('start', (e) => {
      try {
        const data = JSON.parse(e.data);
        progressText.textContent = t('convert.converting');
        progressCount.textContent = t('progress.count', { current: 0, total: data.total });
      } catch {}
    });

    es.addEventListener('progress', (e) => {
      try {
        const data = JSON.parse(e.data);
        progressText.textContent = t('convert.convertingFile', { file: data.file });
        progressCount.textContent = t('progress.count', { current: data.current, total: data.total });
      } catch {}
    });

    es.addEventListener('file-done', (e) => {
      try {
        const data = JSON.parse(e.data);
        state.results.push(data);
        const pct = (data.current / data.total) * 100;
        setProgress(pct);
        progressCount.textContent = t('progress.count', { current: data.current, total: data.total });
        addResultRow(data);
      } catch {}
    });

    es.addEventListener('complete', () => {
      es.close();
      if (!resolved) {
        resolved = true;
        showResults();
        resolve();
      }
    });

    es.addEventListener('error', () => {
      es.close();
      if (!resolved) {
        resolved = true;
        if (state.results.length > 0) {
          showResults();
          resolve();
        } else {
          reject(new Error('SSE failed'));
        }
      }
    });
  });
}

async function convertWithPOST() {
  try {
    progressText.textContent = t('convert.convertingAll');

    const res = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId: state.batchId, preset: state.preset }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Conversion failed');
    }

    const data = await res.json();
    state.results = data.results;
    setProgress(100);

    for (const result of data.results) {
      addResultRow(result);
    }

    showResults();
  } catch (err) {
    alert(t('conversion.error', { message: err.message }));
  }
}
