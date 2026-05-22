const express  = require('express');
const router   = express.Router();
const { getPool }             = require('../db/connection');
const { generateCRN }         = require('../utils/crnGenerator');
const { sendAcknowledgement } = require('../utils/emailService');
const { writeAuditLog }       = require('../utils/auditLog');
const { upload }              = require('../middleware/upload');
const { validateComplaint }   = require('../middleware/validate');
const { requireAuth }         = require('../middleware/auth');
const logger                  = require('../utils/logger');

function getIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
}

// ── POST /api/complaints — submit new complaint (public) ─────
router.post('/',
  upload.array('files', parseInt(process.env.MAX_FILES || '5')),
  validateComplaint,
  async (req, res) => {
    const b = req.body;
    const isAnon = b.submissionType === 'Anonymous';
    const ip = getIP(req);
    try {
      const crn = await generateCRN();
      const ciaboc = b.seniorManagement === 'Yes' ? 1 : 0;

      const parseEvidenceTypes = () => {
        try {
          const arr = JSON.parse(b.evidenceTypes || '[]');
          return Array.isArray(arr) ? arr.join(', ') : (b.evidenceTypes || null);
        } catch { return b.evidenceTypes || null; }
      };

      const [result] = await getPool().query(
        `INSERT INTO complaints (
          crn, submission_type, reporter_category,
          full_name, staff_id, division, reporter_designation,
          contact_email, contact_tel, preferred_contact,
          complaint_category, incident_date_from, incident_date_to,
          incident_location, frequency, description,
          awareness_method, previously_reported, previous_report_details,
          subject_names, subject_designation, subject_org, subject_relationship,
          involves_senior_mgmt, senior_names, ciaboc_escalation,
          has_evidence, evidence_types, witness_names, additional_info, ip_address
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          crn, b.submissionType, b.reporterCategory,
          isAnon ? null : (b.fullName || null),
          isAnon ? null : (b.staffId || null),
          b.division || null,
          b.reporterDesignation || null,
          isAnon ? null : (b.contactEmail || null),
          isAnon ? null : (b.contactTel || null),
          isAnon ? null : (b.preferredContact || null),
          b.category, b.dateFrom, b.dateTo || null,
          b.location, b.frequency, b.description,
          b.awarenessMethod, b.previouslyReported, b.previousReportDetails || null,
          b.subjectNames || null, b.subjectDesignation || null,
          b.subjectOrg || null, b.subjectRelationship || null,
          b.seniorManagement, b.seniorNames || null, ciaboc,
          b.hasEvidence, parseEvidenceTypes(),
          b.witnesses || null, b.additionalInfo || null,
          isAnon ? null : ip,
        ]
      );

      if (req.files?.length) {
        const fileRows = req.files.map(f => [result.insertId, crn, f.originalname, f.filename, f.mimetype, f.size]);
        await getPool().query(
          `INSERT INTO complaint_files (complaint_id,crn,original_name,stored_name,mime_type,file_size) VALUES ?`,
          [fileRows]
        );
      }

      await writeAuditLog({
        eventType: 'SUBMISSION', crn, actor: 'reporter',
        description: `New ${b.submissionType} complaint. Category: ${b.category}. CIABOC: ${ciaboc ? 'YES' : 'NO'}.`,
        ipAddress: isAnon ? null : ip,
      });

      if (!isAnon && b.contactEmail) {
        sendAcknowledgement(b.contactEmail, crn, new Date().toISOString())
          .catch(e => logger.error(`[Email] ${e.message}`));
      }

      logger.info(`[Complaint] Submitted CRN=${crn}`);
      return res.status(201).json({ success: true, crn, submittedAt: new Date().toISOString(), ciabocEscalation: !!ciaboc });
    } catch (err) {
      logger.error(`[Complaint] Submit error: ${err.message}`);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
);

// ── GET /api/complaints/track/:crn — public status tracker ───
// Returns ONLY status and non-sensitive fields — no personal data
router.get('/track/:crn', async (req, res) => {
  try {
    const crn = req.params.crn.toUpperCase();
    const [[row]] = await getPool().query(
      `SELECT crn, complaint_category, submission_type,
              status, submitted_at, updated_at
       FROM complaints WHERE crn = ?`, [crn]
    );
    if (!row) return res.status(404).json({ success: false, message: 'No complaint found with this CRN. Please check the number and try again.' });

    await writeAuditLog({ eventType: 'COMPLAINT_TRACK', crn, actor: 'reporter', description: 'Public status check.' });
    return res.json({ success: true, ...row });
  } catch (err) {
    logger.error(`[Track] ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/complaints — list all (admin only) ──────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || '1'));
    const limit  = Math.min(100, parseInt(req.query.limit || '15'));
    const offset = (page - 1) * limit;
    const conditions = [], params = [];
    if (req.query.status)  { conditions.push('status = ?');              params.push(req.query.status); }
    if (req.query.category){ conditions.push('complaint_category = ?');  params.push(req.query.category); }
    if (req.query.ciaboc === '1') conditions.push('ciaboc_escalation = 1');
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [[{ total }]] = await getPool().query(`SELECT COUNT(*) AS total FROM complaints ${where}`, params);
    const [rows] = await getPool().query(
      `SELECT id,crn,submission_type,reporter_category,complaint_category,
              incident_date_from,incident_location,frequency,involves_senior_mgmt,
              ciaboc_escalation,has_evidence,status,submitted_at
       FROM complaints ${where} ORDER BY submitted_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return res.json({ success: true, data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    logger.error(`[Complaint] List: ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/complaints/:crn — full detail (admin only) ──────
router.get('/:crn', requireAuth, async (req, res) => {
  try {
    const crn = req.params.crn.toUpperCase();
    const [[complaint]] = await getPool().query('SELECT * FROM complaints WHERE crn = ?', [crn]);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    const [files] = await getPool().query(
      'SELECT id,original_name,mime_type,file_size,uploaded_at FROM complaint_files WHERE crn = ?', [crn]
    );
    await writeAuditLog({ eventType: 'COMPLAINT_VIEW', crn, actor: req.admin?.username || 'iau_panel', description: 'Complaint viewed.' });
    return res.json({ success: true, data: { ...complaint, files } });
  } catch (err) {
    logger.error(`[Complaint] Fetch: ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── PATCH /api/complaints/:crn/status (admin only) ───────────
router.patch('/:crn/status', requireAuth, async (req, res) => {
  const VALID = ['Submitted','Under Review','Escalated','Closed','Rejected'];
  const { status } = req.body;
  if (!VALID.includes(status)) return res.status(400).json({ success: false, message: `Invalid status.` });
  try {
    const crn = req.params.crn.toUpperCase();
    const [result] = await getPool().query('UPDATE complaints SET status = ? WHERE crn = ?', [status, crn]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    await writeAuditLog({ eventType: 'STATUS_CHANGE', crn, actor: req.admin?.username || 'iau_panel', description: `Status → ${status}` });
    return res.json({ success: true, message: `Status updated to ${status}.` });
  } catch (err) {
    logger.error(`[Complaint] Status update: ${err.message}`);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
