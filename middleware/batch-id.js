const { v4: uuidv4 } = require('uuid');

function batchIdMiddleware(req, _res, next) {
  req.batchId = req.headers['x-batch-id'] || uuidv4();
  next();
}

module.exports = batchIdMiddleware;
