const express = require('express');
const fs = require('fs');
const path = require('path');
const { WEBP_PRESETS } = require('../config/presets');
const { UPLOADS_DIR, OUTPUT_DIR } = require('../config/server.config');
const { convertFile } = require('../services/image-converter');

const router = express.Router();

router.post('/convert', async (req, res) => {
  try {
    const { batchId, preset = 'medium' } = req.body;
    if (!batchId) return res.status(400).json({ error: 'batchId required', errorCode: 'BATCH_ID_REQUIRED' });

    const webpOpts = WEBP_PRESETS[preset] || WEBP_PRESETS.medium;
    const batchUploadDir = path.join(UPLOADS_DIR, batchId);
    const batchOutputDir = path.join(OUTPUT_DIR, batchId);
    fs.mkdirSync(batchOutputDir, { recursive: true });

    if (!fs.existsSync(batchUploadDir)) {
      return res.status(404).json({ error: 'Batch not found', errorCode: 'BATCH_NOT_FOUND' });
    }

    const files = fs.readdirSync(batchUploadDir);
    const results = [];

    for (const file of files) {
      const inputPath = path.join(batchUploadDir, file);
      const outputName = path.parse(file).name + '.webp';
      const outputPath = path.join(batchOutputDir, outputName);

      try {
        const inputStat = fs.statSync(inputPath);
        await convertFile(inputPath, outputPath, webpOpts);
        const outputStat = fs.statSync(outputPath);

        results.push({
          id: file,
          outputName,
          originalSize: inputStat.size,
          convertedSize: outputStat.size,
          savings: ((1 - outputStat.size / inputStat.size) * 100).toFixed(1),
          status: 'success',
        });
      } catch (err) {
        results.push({
          id: file,
          outputName,
          originalSize: 0,
          convertedSize: 0,
          savings: '0',
          status: 'error',
          error: err.message,
        });
      }
    }

    res.json({ batchId, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/convert-stream', async (req, res) => {
  const { batchId, preset = 'medium' } = req.query;
  if (!batchId) return res.status(400).json({ error: 'batchId required', errorCode: 'BATCH_ID_REQUIRED' });

  const webpOpts = WEBP_PRESETS[preset] || WEBP_PRESETS.medium;
  const batchUploadDir = path.join(UPLOADS_DIR, batchId);
  const batchOutputDir = path.join(OUTPUT_DIR, batchId);
  fs.mkdirSync(batchOutputDir, { recursive: true });

  if (!fs.existsSync(batchUploadDir)) {
    return res.status(404).json({ error: 'Batch not found', errorCode: 'BATCH_NOT_FOUND' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const files = fs.readdirSync(batchUploadDir);
  const total = files.length;

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('start', { total });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(batchUploadDir, file);
    const outputName = path.parse(file).name + '.webp';
    const outputPath = path.join(batchOutputDir, outputName);

    try {
      const inputStat = fs.statSync(inputPath);
      sendEvent('progress', { current: i + 1, total, file, status: 'converting' });

      await convertFile(inputPath, outputPath, webpOpts);
      const outputStat = fs.statSync(outputPath);

      sendEvent('file-done', {
        id: file,
        outputName,
        originalSize: inputStat.size,
        convertedSize: outputStat.size,
        savings: ((1 - outputStat.size / inputStat.size) * 100).toFixed(1),
        status: 'success',
        current: i + 1,
        total,
      });
    } catch (err) {
      sendEvent('file-done', {
        id: file,
        outputName,
        originalSize: 0,
        convertedSize: 0,
        savings: '0',
        status: 'error',
        error: err.message,
        current: i + 1,
        total,
      });
    }
  }

  sendEvent('complete', { total });
  res.end();
});

module.exports = router;
