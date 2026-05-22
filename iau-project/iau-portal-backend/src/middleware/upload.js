const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(UPLOAD_DIR)) { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); }

const ALLOWED = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb)  => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`),
});

function fileFilter(_req, file, cb) {
  ALLOWED.has(file.mimetype) ? cb(null, true) : cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
}

const upload = multer({
  storage, fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || String(10 * 1024 * 1024)),
    files:    parseInt(process.env.MAX_FILES || '5'),
  },
});

module.exports = { upload, UPLOAD_DIR };
