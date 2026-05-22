import React, { useState } from 'react';
import { trackComplaint } from '../api';

const STATUS_INFO = {
  'Submitted':    { icon: '📋', desc: 'Your complaint has been received and is awaiting review by the IAU.' },
  'Under Review': { icon: '🔍', desc: 'The IAU is currently reviewing your complaint and conducting a preliminary assessment.' },
  'Escalated':    { icon: '⚠️', desc: 'Your complaint has been escalated for further investigation or CIABOC referral.' },
  'Closed':       { icon: '✅', desc: 'Your complaint has been reviewed and the matter has been concluded.' },
  'Rejected':     { icon: '❌', desc: 'Your complaint could not be processed. Please contact the IAU for more information.' },
};

export default function TrackComplaint() {
  const [crn, setCrn]         = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleTrack = async () => {
    const val = crn.trim().toUpperCase();
    if (!val) { setError('Please enter a Complaint Reference Number.'); return; }
    if (!val.startsWith('IAU-')) { setError('Please enter a valid CRN (e.g. IAU-2026-000001).'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await trackComplaint(val);
      setResult(data);
    } catch(e) {
      setError(e.message || 'Complaint not found. Please check your CRN and try again.');
    } finally { setLoading(false); }
  };

  const info = result ? (STATUS_INFO[result.status] || { icon: '📋', desc: '' }) : null;

  return (
    <div className="track-panel">
      <div className="track-header">
        <div className="track-title">🔎 Track Your Complaint</div>
        <div className="track-sub">Enter your Complaint Reference Number (CRN) to check the current status</div>
      </div>
      <div className="track-body">
        <div className="track-input-row">
          <div style={{ display:'flex', flexDirection:'column', gap:5, flex:1 }}>
            <label style={{ fontSize:11.5, fontWeight:600, color:'var(--gray-700)' }}>
              Complaint Reference Number
            </label>
            <input
              type="text"
              placeholder="e.g. IAU-2026-000001"
              value={crn}
              onChange={e => { setCrn(e.target.value.toUpperCase()); setError(''); setResult(null); }}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              style={{ fontFamily:'JetBrains Mono,monospace', letterSpacing:'1px' }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleTrack}
            disabled={loading}
            style={{ alignSelf:'flex-end', padding:'9px 20px' }}
          >
            {loading ? '⏳' : '🔍'} {loading ? 'Searching…' : 'Track'}
          </button>
        </div>

        {error && (
          <div className="alert-box danger" style={{ marginTop:14 }}>
            <span className="alert-icon">⚠️</span><span>{error}</span>
          </div>
        )}

        {result && (
          <div className="track-result">
            <div className="track-status-card">
              <div className="track-crn-label">Complaint Reference Number</div>
              <div className="track-crn-value">{result.crn}</div>

              <div className="track-status-row">
                <span style={{ fontSize:22 }}>{info.icon}</span>
                <div>
                  <span className={`status-badge status-${result.status.replace(/ /g,'-')}`} style={{ fontSize:12, padding:'4px 12px' }}>
                    {result.status}
                  </span>
                  <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:5, lineHeight:1.5 }}>
                    {info.desc}
                  </div>
                </div>
              </div>

              <div className="track-meta-grid">
                <div className="track-meta-item">
                  <label>Category</label>
                  <p>{result.complaint_category}</p>
                </div>
                <div className="track-meta-item">
                  <label>Submitted On</label>
                  <p>{new Date(result.submitted_at).toLocaleDateString('en-GB', { dateStyle:'long' })}</p>
                </div>
                <div className="track-meta-item">
                  <label>Submission Type</label>
                  <p>{result.submission_type}</p>
                </div>
                <div className="track-meta-item">
                  <label>Last Updated</label>
                  <p>{new Date(result.updated_at).toLocaleDateString('en-GB', { dateStyle:'long' })}</p>
                </div>
              </div>

              <div className="alert-box info" style={{ marginTop:14 }}>
                <span className="alert-icon">🔒</span>
                <span>For confidentiality, only the status and basic details are shown. Contact the IAU directly for further information using this CRN.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
