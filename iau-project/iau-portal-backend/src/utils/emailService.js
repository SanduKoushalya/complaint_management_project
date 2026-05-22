const nodemailer = require('nodemailer');
const logger     = require('./logger');

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

async function sendAcknowledgement(toEmail, crn, submittedAt) {
  if (process.env.SMTP_ENABLED !== 'true') {
    logger.info(`[Email] Skipping (SMTP_ENABLED=false) for ${toEmail} CRN=${crn}`);
    return;
  }
  const dateStr = new Date(submittedAt).toLocaleString('en-GB', { dateStyle:'long', timeStyle:'short', timeZone:'Asia/Colombo' });
  await getTransporter().sendMail({
    from:    process.env.EMAIL_FROM || '"SLTMobitel IAU" <iau-noreply@sltmobitel.lk>',
    to:      toEmail,
    subject: `[SLTMobitel IAU] Complaint Received – ${crn}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#1B3F8F;padding:20px 28px;border-radius:6px 6px 0 0">
        <h2 style="color:#fff;margin:0;font-size:16px">SLTMobitel Internal Affairs Unit</h2>
        <p style="color:rgba(255,255,255,0.65);margin:4px 0 0;font-size:12px">Complaint & Concern Reporting Portal</p>
      </div>
      <div style="background:#fff;padding:24px 28px;border:1px solid #E2E8F0;border-top:none">
        <p>Dear Reporter,</p>
        <p>Your complaint has been successfully submitted. Your Complaint Reference Number is:</p>
        <div style="background:#0F2447;color:#fff;font-family:monospace;font-size:20px;padding:14px 24px;border-radius:6px;text-align:center;letter-spacing:3px;margin:16px 0">${crn}</div>
        <p><strong>Submitted:</strong> ${dateStr}</p>
        <p>The IAU will conduct a preliminary assessment. You will be contacted if further information is required.</p>
        <p style="font-size:11px;color:#94A3B8;margin-top:20px">This is an automated acknowledgement. Do not reply to this email.<br/>SLTMobitel IAU · CEO Circular No. 23/2026 · CONFIDENTIAL</p>
      </div>
    </div>`,
  });
  logger.info(`[Email] Sent to ${toEmail} for CRN ${crn}`);
}

module.exports = { sendAcknowledgement };
