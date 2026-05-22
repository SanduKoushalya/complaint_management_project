const { getPool } = require('../db/connection');

async function generateCRN() {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const year = new Date().getFullYear();
    await conn.query(
      `INSERT INTO crn_sequence (year, last_seq) VALUES (?, 1)
       ON DUPLICATE KEY UPDATE last_seq = last_seq + 1`,
      [year]
    );
    const [[row]] = await conn.query(
      'SELECT last_seq FROM crn_sequence WHERE year = ? FOR UPDATE', [year]
    );
    await conn.commit();
    return `IAU-${year}-${String(row.last_seq).padStart(6, '0')}`;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { generateCRN };
