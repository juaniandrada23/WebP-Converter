const express = require('express');
const sharp = require('sharp');
const path = require('path');
const upload = require('../middleware/upload');
const { UPLOAD_LIMITS } = require('../config/server.config');
const { registerBatch } = require('../services/batch-storage');

const router = express.Router();

router.post('/', upload.array('images', UPLOAD_LIMITS.files), async (req, res) => {
  try {
    const batchId = req.batchId;
    registerBatch(batchId);

    const filesInfo = await Promise.all(
      req.files.map(async (file) => {
        let metadata = {};
        try {
          metadata = await sharp(file.path).metadata();
        } catch {}
        return {
          id: path.basename(file.path),
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          width: metadata.width || null,
          height: metadata.height || null,
          format: metadata.format || null,
        };
      })
    );

    res.json({ batchId, files: filesInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
