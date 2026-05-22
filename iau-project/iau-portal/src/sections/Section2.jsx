import React from 'react';

const CATEGORIES = ['Bribery','Corruption','Fraud','Financial Misconduct','Abuse of Authority or Position',
  'Misappropriation of Public or Company Property','Conflict of Interest','Procurement Irregularity',
  'Falsification of Records','Harassment / Workplace Misconduct','Breach of Confidentiality',
  'Non-compliance with Policy or Regulation','Other Malpractice'];

export default function Section2({ data, onChange }) {
  const set = (f,v) => onChange({ ...data, [f]:v });
  const today = new Date().toISOString().split('T')[0];
  const descLen = (data.description||'').length;

  return (
    <div className="form-card">
      <div className="section-header">
        <div className="section-step-tag"><span className="step-dot"/>Section 02</div>
        <div className="section-title">Complaint / Concern Details</div>
        <div className="section-desc">Provide as much detail as possible. All fields marked with * are required.</div>
      </div>
      <div className="form-body">
        <div className="form-grid">

          <div className="field-group span-2">
            <label>Complaint Category <span className="required-star">*</span></label>
            <select value={data.category} onChange={e => set('category',e.target.value)}>
              <option value="">— Select the nature of the complaint —</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label>Date of Incident (From) <span className="required-star">*</span></label>
            <input type="date" max={today} value={data.dateFrom} onChange={e => set('dateFrom',e.target.value)}/>
            <span className="field-hint">Future dates are not permitted.</span>
          </div>

          <div className="field-group">
            <label>Date of Incident (To)</label>
            <input type="date" max={today} min={data.dateFrom} value={data.dateTo} onChange={e => set('dateTo',e.target.value)}/>
            <span className="field-hint">Leave blank for single-date incident.</span>
          </div>

          <div className="field-group span-2">
            <label>Location / Division <span className="required-star">*</span></label>
            <input type="text" placeholder="e.g. Procurement Unit, Head Office, Mobitel Regional Office – Kandy" value={data.location} onChange={e => set('location',e.target.value)}/>
          </div>

          <div className="field-group span-2">
            <label>Frequency of Occurrence <span className="required-star">*</span></label>
            <div className="radio-group">
              {['One-time incident','Repeated – periodic','Ongoing / continuous','Unknown'].map(opt => (
                <label key={opt} className={`radio-option ${data.frequency===opt?'selected':''}`}>
                  <input type="radio" name="frequency" value={opt} checked={data.frequency===opt} onChange={() => set('frequency',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-group span-2">
            <label>Description of Complaint <span className="required-star">*</span></label>
            <textarea rows={5} placeholder="Describe what occurred, when, where and who was involved. Minimum 50 characters required."
              value={data.description} onChange={e => set('description',e.target.value)}/>
            <span className={`char-count ${descLen>0&&descLen<50?'warn':''}`}>
              {descLen<50 ? `${50-descLen} more characters required` : `${descLen} characters`}
            </span>
          </div>

          <div className="field-group span-2">
            <label>How Did You Become Aware? <span className="required-star">*</span></label>
            <div className="radio-group">
              {['Direct witness','Informed by another party','Discovered through documents or records','Other'].map(opt => (
                <label key={opt} className={`radio-option ${data.awarenessMethod===opt?'selected':''}`}>
                  <input type="radio" name="awarenessMethod" value={opt} checked={data.awarenessMethod===opt} onChange={() => set('awarenessMethod',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-group span-2">
            <label>Has This Matter Been Reported Previously? <span className="required-star">*</span></label>
            <div className="radio-group">
              {['Yes','No'].map(opt => (
                <label key={opt} className={`radio-option ${data.previouslyReported===opt?'selected':''}`}>
                  <input type="radio" name="previouslyReported" value={opt} checked={data.previouslyReported===opt} onChange={() => set('previouslyReported',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {data.previouslyReported==='Yes' && (
            <div className="field-group span-2">
              <label>If Yes — To Whom and What Was the Outcome? <span className="conditional-badge">conditional</span></label>
              <textarea rows={3} placeholder="State the authority or person it was reported to and the outcome."
                value={data.previousReportDetails} onChange={e => set('previousReportDetails',e.target.value)}/>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
