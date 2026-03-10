import { dropzone, fileInput } from './dom.js';
import { handleFiles } from './upload.js';

export function initDropzone() {
  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) handleFiles(files);
  });

  fileInput.addEventListener('change', () => {
    const files = [...fileInput.files];
    if (files.length > 0) handleFiles(files);
    fileInput.value = '';
  });
}
