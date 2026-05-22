const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const { getPool }       = require('../db/connection');
const { writeAuditLog } = require('../utils/auditLog');
const { UPLOAD_DIR }    = require('../middleware/upload');
const { requireAuth }   = require('../middleware/auth');
const logger            = require('../utils/logger');

router.get('/:fileId', requireAuth, async (req, res) => {
  const fileId = parseInt(req.params.fileId);
  if (!fileId || isNaN(fileId)) return res.status(400).json({ success: false, message: 'Invalid file ID.' });
  try {
    const [[file]] = await getPool().query('SELECT * FROM complaint_files WHERE id = ?', [fileId]);
    if (!file) return res.status(404).json({ success: false, message: 'File not found.' });
    const filePath = path.join(UPLOAD_DIR, file.stored_name);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on server.' });
    await writeAuditLog({ eventType: 'FILE_DOWNLOAD', crn: file.crn, actor: req.admin?.username || 'iau_panel', description: `Downloaded: ${file.original_name}` });
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Type', file.mime_type);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    logger.error(`[Files] ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
