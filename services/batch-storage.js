const fs = require('fs');
const path = require('path');
const { UPLOADS_DIR, OUTPUT_DIR, CLEANUP_INTERVAL_MS, CLEANUP_MAX_AGE_MS } = require('../config/server.config');

const batchTimestamps = new Map();

function registerBatch(batchId) {
  batchTimestamps.set(batchId, Date.now());
}

function cleanupBatch(batchId) {
  const uploadDir = path.join(UPLOADS_DIR, batchId);
  const outputDir = path.join(OUTPUT_DIR, batchId);
  try { fs.rmSync(uploadDir, { recursive: true, force: true }); } catch {}
  try { fs.rmSync(outputDir, { recursive: true, force: true }); } catch {}
  batchTimestamps.delete(batchId);
}

function startAutoCleanup() {
  setInterval(() => {
    const now = Date.now();
    for (const [batchId, timestamp] of batchTimestamps) {
      if (now - timestamp > CLEANUP_MAX_AGE_MS) {
        cleanupBatch(batchId);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

module.exports = { batchTimestamps, registerBatch, cleanupBatch, startAutoCleanup };
