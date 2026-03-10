require('dotenv').config();

const express = require('express');
const compression = require('compression');
const path = require('path');
const { PORT, STATIC_MAX_AGE } = require('./config/server.config');
const securityHeaders = require('./middleware/security-headers');
const batchIdMiddleware = require('./middleware/batch-id');
const errorHandler = require('./middleware/error-handler');
const configRoutes = require('./routes/config.routes');
const uploadRoutes = require('./routes/upload.routes');
const convertRoutes = require('./routes/convert.routes');
const downloadRoutes = require('./routes/download.routes');
const cleanupRoutes = require('./routes/cleanup.routes');
const { startAutoCleanup } = require('./services/batch-storage');

const app = express();

app.use(securityHeaders);
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: STATIC_MAX_AGE }));
app.use(express.json());

app.use('/api', configRoutes);
app.use('/api/upload', batchIdMiddleware, uploadRoutes);
app.use('/api', convertRoutes);
app.use('/api', downloadRoutes);
app.use('/api', cleanupRoutes);

app.use(errorHandler);

startAutoCleanup();

app.listen(PORT, () => {
  console.log(`WebP Converter running at http://localhost:${PORT}`);
});
