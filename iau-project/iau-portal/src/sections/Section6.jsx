import React, { useState } from 'react';
import { generateComplaintPDF } from '../utils/pdfGenerator';

export default function Section6({ crn, submittedAt, formData, onReset }) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const dateStr = submittedAt
    ? new Date(submittedAt).toLocaleString('en-GB', { dateStyle:'long', timeStyle:'short' })
    : new Date().toLocaleString('en-GB', { dateStyle:'long', timeStyle:'short' });

  const handleDownloadPDF = () => {
    setPdfLoading(true);
    try {
      generateComplaintPDF(formData, crn, submittedAt);
    } catch(e) {
      console.error('PDF error:', e);
    } finally {
      setTimeout(() => setPdfLoading(false), 1000);
    }
  };

  return (
    <div className="confirmation-screen">
      <div className="conf-top-bar" />
      <div className="confirmation-inner" style={{ textAlign:'center' }}>

        <div className="confirmation-icon">✓</div>
        <div className="confirmation-title">Submission Received</div>
        <p className="confirmation-text" style={{ marginBottom:8 }}>
          Your complaint has been successfully submitted to the SLTMobitel Internal Affairs Unit.
          Please record your Complaint Reference Number below for all future correspondence.
        </p>

        <div className="crn-display">{crn}</div>

        <p className="confirmation-text" style={{ marginBottom:22 }}>
          Submitted on <strong>{dateStr}</strong>
        </p>

        {/* Action buttons */}
        <div className="conf-actions">
          <button
            className="btn btn-green"
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            style={{ fontSize:13.5, padding:'10px 24px' }}
          >
            {pdfLoading ? '⏳ Generating…' : '📄 Download as PDF'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onReset}
          >
            Submit Another Complaint
          </button>
        </div>

        <div className="alert-box success" style={{ maxWidth:500, margin:'20px auto 12px', textAlign:'left' }}>
          <span className="alert-icon">📧</span>
          <div>If you provided an email address, an automated acknowledgement containing your CRN and IAU contact details has been sent to your inbox.</div>
        </div>

        <div className="alert-box info" style={{ maxWidth:500, margin:'0 auto 20px', textAlign:'left' }}>
          <span className="alert-icon">🔎</span>
          <div>
            <strong>Track your complaint:</strong> Use the <em>"Track Complaint"</em> button on the main portal page and enter your CRN <strong>{crn}</strong> at any time to check the current status.
          </div>
        </div>

        <div style={{ paddingTop:20, borderTop:'1px solid var(--gray-200)' }}>
          <p style={{ fontSize:11, color:'var(--gray-400)', lineHeight:1.6 }}>
            This portal is operated by the Internal Affairs Unit (IAU) of SLTMobitel.
          </p>
        </div>
      </div>
    </div>
  );
}
