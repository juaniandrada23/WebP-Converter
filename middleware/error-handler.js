const multer = require('multer');
const { UPLOAD_LIMITS } = require('../config/server.config');

function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxMB = Math.round(UPLOAD_LIMITS.fileSize / (1024 * 1024));
      return res.status(413).json({
        error: `File too large. Maximum size is ${maxMB} MB.`,
        errorCode: 'FILE_TOO_LARGE',
        errorParams: { maxMB: maxMB + ' MB' },
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: `Too many files. Maximum is ${UPLOAD_LIMITS.files}.`,
        errorCode: 'FILE_COUNT_EXCEEDED',
        errorParams: { max: UPLOAD_LIMITS.files },
      });
    }
    return res.status(400).json({ error: err.message, errorCode: 'INTERNAL_ERROR' });
  }
  if (err.message && err.message.startsWith('Unsupported format')) {
    const match = err.message.match(/Unsupported format[:\s]*(.+)/);
    const format = match ? match[1].trim() : '';
    return res.status(415).json({
      error: err.message,
      errorCode: 'UNSUPPORTED_FORMAT',
      errorParams: { format },
    });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
}

module.exports = errorHandler;
