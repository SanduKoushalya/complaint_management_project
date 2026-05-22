const jwt    = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'iau-portal-change-this-secret';

function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch (err) {
    logger.warn(`[Auth] Invalid token: ${err.message}`);
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}

module.exports = { requireAuth, JWT_SECRET };
