const express = require('express');
const { UPLOAD_LIMITS } = require('../config/server.config');

const router = express.Router();

router.get('/config', (_req, res) => {
  res.json({
    maxFileSize: UPLOAD_LIMITS.fileSize,
    maxFileCount: UPLOAD_LIMITS.files,
  });
});

module.exports = router;
