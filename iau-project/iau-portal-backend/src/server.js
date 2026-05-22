require('dotenv').config();

const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const logger            = require('./utils/logger');
const { testConnection }= require('./db/connection');
const complaintsRouter  = require('./routes/complaints');
const filesRouter       = require('./routes/files');
const healthRouter      = require('./routes/health');
const adminRouter       = require('./routes/admin');

const app  = express();
const PORT = parseInt(process.env.PORT || '5000');

// ── Security ─────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [process.env.FRONTEND_URL || 'http://localhost:3000'];
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  methods: ['GET','POST','PATCH','OPTIONS'],
  credentials: true,
}));

// ── Body parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── General rate limiter ──────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max:      parseInt(process.env.RATE_LIMIT_MAX       || '500'),
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Strict limiter only on POST submissions (not admin GET requests)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 20,
  message: { success: false, message: 'Submission limit reached. Please try again later.' },
});
app.post('/api/complaints', submitLimiter);

// ── Request logger ────────────────────────────────────────────
app.use((req, _res, next) => { logger.debug(`${req.method} ${req.path}`); next(); });

// ── Routes ────────────────────────────────────────────────────
app.use('/api',            healthRouter);
app.use('/api/admin',      adminRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/files',      filesRouter);

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ── Error handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  logger.error(`Unhandled: ${err.message}`);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────
async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      logger.info(`IAU Portal backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  }
}

start();
