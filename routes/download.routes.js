const express = require('express');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { OUTPUT_DIR, ZIP_FILENAME_PREFIX, ZIP_COMPRESSION_LEVEL } = require('../config/server.config');

const router = express.Router();

router.get('/download/:batchId', (req, res) => {
  const { batchId } = req.params;
  const batchOutputDir = path.join(OUTPUT_DIR, batchId);

  if (!fs.existsSync(batchOutputDir)) {
    return res.status(404).json({ error: 'No converted files found', errorCode: 'NO_CONVERTED_FILES' });
  }

  const files = fs.readdirSync(batchOutputDir);
  if (files.length === 0) {
    return res.status(404).json({ error: 'No converted files found', errorCode: 'NO_CONVERTED_FILES' });
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${ZIP_FILENAME_PREFIX}-${batchId.slice(0, 8)}.zip"`);

  const archive = archiver('zip', { zlib: { level: ZIP_COMPRESSION_LEVEL } });
  archive.on('error', (err) => res.status(500).json({ error: err.message }));
  archive.pipe(res);

  for (const file of files) {
    archive.file(path.join(batchOutputDir, file), { name: file });
  }

  archive.finalize();
});

module.exports = router;
