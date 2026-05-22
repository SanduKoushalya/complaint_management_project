const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { getPool }       = require('../db/connection');
const { writeAuditLog } = require('../utils/auditLog');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const logger            = require('../utils/logger');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required.' });
  try {
    const [[user]] = await getPool().query(
      'SELECT * FROM admin_users WHERE username = ? AND is_active = 1',
      [username.trim().toLowerCase()]
    );
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      logger.warn(`[Admin] Failed login: ${username}`);
      await writeAuditLog({ eventType: 'ADMIN_LOGIN_FAIL', actor: username, description: 'Failed login attempt.', ipAddress: ip });
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    await getPool().query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    await writeAuditLog({ eventType: 'ADMIN_LOGIN', actor: user.username, description: `Login. Role: ${user.role}.`, ipAddress: ip });
    logger.info(`[Admin] Login: ${user.username}`);
    return res.json({ success: true, token, admin: { id: user.id, username: user.username, full_name: user.full_name, role: user.role } });
  } catch (err) {
    logger.error(`[Admin] Login error: ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// GET /api/admin/audit-log (protected)
router.get('/audit-log', requireAuth, async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || '1'));
    const limit  = Math.min(100, parseInt(req.query.limit || '20'));
    const offset = (page - 1) * limit;
    const conditions = [], params = [];
    if (req.query.eventType) { conditions.push('event_type = ?'); params.push(req.query.eventType); }
    if (req.query.crn)       { conditions.push('crn = ?');        params.push(req.query.crn.toUpperCase()); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [[{ total }]] = await getPool().query(`SELECT COUNT(*) AS total FROM audit_log ${where}`, params);
    const [rows] = await getPool().query(
      `SELECT id,event_type,crn,actor,description,ip_address,occurred_at FROM audit_log ${where} ORDER BY occurred_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return res.json({ success: true, data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    logger.error(`[Admin] Audit log: ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
