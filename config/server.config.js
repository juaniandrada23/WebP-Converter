const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const UPLOAD_LIMITS = { fileSize: 50 * 1024 * 1024, files: 50 };

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const CLEANUP_MAX_AGE_MS = 30 * 60 * 1000;

const ZIP_FILENAME_PREFIX = 'webp-images';
const ZIP_COMPRESSION_LEVEL = 1;

const STATIC_MAX_AGE = '1d';

module.exports = {
  PORT,
  UPLOADS_DIR,
  OUTPUT_DIR,
  UPLOAD_LIMITS,
  CLEANUP_INTERVAL_MS,
  CLEANUP_MAX_AGE_MS,
  ZIP_FILENAME_PREFIX,
  ZIP_COMPRESSION_LEVEL,
  STATIC_MAX_AGE,
};
