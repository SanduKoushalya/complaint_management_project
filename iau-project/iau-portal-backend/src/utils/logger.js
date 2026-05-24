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

app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    cb(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  methods: ['GET','POST','PATCH','OPTIONS'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max:      parseInt(process.env.RATE_LIMIT_MAX       || '500'),
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Submission limit reached. Please try again later.' },
});
app.post('/api/complaints', submitLimiter);

app.use((req, _res, next) => { logger.debug(`${req.method} ${req.path}`); next(); });

app.use('/api',            healthRouter);
app.use('/api/admin',      adminRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/files',      filesRouter);

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

app.use((err, _req, res, _next) => {
  logger.error(`Unhandled: ${err.message}`);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

async function start() {
  try {
    await testConnection();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`IAU Portal backend running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  }
}

start();