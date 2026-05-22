const express = require('express');
const router  = express.Router();
const { getPool }     = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const logger          = require('../utils/logger');

router.get('/health', async (_req, res) => {
  try {
    await getPool().query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

router.get('/stats', requireAuth, async (_req, res) => {
  try {
    const pool = getPool();
    const [[totals]] = await pool.query(`
      SELECT COUNT(*) AS total,
        SUM(submission_type='Anonymous') AS anonymous_count,
        SUM(submission_type='Named')     AS named_count,
        SUM(ciaboc_escalation=1)         AS ciaboc_flagged,
        SUM(status='Submitted')          AS status_submitted,
        SUM(status='Under Review')       AS status_under_review,
        SUM(status='Escalated')          AS status_escalated,
        SUM(status='Closed')             AS status_closed,
        SUM(status='Rejected')           AS status_rejected
      FROM complaints`);
    const [byCategory] = await pool.query(
      `SELECT complaint_category AS category, COUNT(*) AS count FROM complaints GROUP BY complaint_category ORDER BY count DESC`
    );
    const [recentSubmissions] = await pool.query(
      `SELECT crn,complaint_category,submission_type,status,submitted_at FROM complaints ORDER BY submitted_at DESC LIMIT 10`
    );
    res.json({ success: true, totals, byCategory, recentSubmissions });
  } catch (err) {
    logger.error(`[Stats] ${err.message}`);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
