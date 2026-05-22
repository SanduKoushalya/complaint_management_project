const { getPool } = require('../db/connection');
const logger      = require('./logger');

async function writeAuditLog({ eventType, crn, actor, description, ipAddress }) {
  try {
    await getPool().query(
      `INSERT INTO audit_log (event_type, crn, actor, description, ip_address)
       VALUES (?, ?, ?, ?, ?)`,
      [eventType, crn || null, actor || 'system', description || null, ipAddress || null]
    );
  } catch (err) {
    logger.error(`[AuditLog] Failed: ${err.message}`);
  }
}

module.exports = { writeAuditLog };
