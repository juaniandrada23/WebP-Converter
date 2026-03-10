const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOADS_DIR, UPLOAD_LIMITS } = require('../config/server.config');
const { ALLOWED_MIMES } = require('../config/presets');

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const batchDir = path.join(UPLOADS_DIR, req.batchId);
    fs.mkdirSync(batchDir, { recursive: true });
    cb(null, batchDir);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: UPLOAD_LIMITS,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported format: ${file.mimetype}`));
    }
  },
});

module.exports = upload;
