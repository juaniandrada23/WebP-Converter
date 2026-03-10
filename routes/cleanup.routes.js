const express = require('express');
const { cleanupBatch } = require('../services/batch-storage');

const router = express.Router();

router.post('/cleanup/:batchId', (req, res) => {
  const { batchId } = req.params;
  cleanupBatch(batchId);
  res.json({ success: true });
});

module.exports = router;
