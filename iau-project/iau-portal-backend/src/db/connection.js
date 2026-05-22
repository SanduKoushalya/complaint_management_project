const mysql  = require('mysql2/promise');
const logger = require('../utils/logger');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME     || 'iau_portal',
      user:     process.env.DB_USER     || 'iau_user',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      timezone: '+00:00',
    });
  }
  return pool;
}

async function testConnection() {
  const conn = await getPool().getConnection();
  await conn.ping();
  conn.release();
  logger.info('MySQL connection verified ✓');
}

module.exports = { getPool, testConnection };
