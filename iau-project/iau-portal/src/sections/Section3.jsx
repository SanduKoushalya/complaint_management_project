import React from 'react';
export default function Section3({ data, onChange }) {
  const set = (f,v) => onChange({ ...data, [f]:v });
  const flagged = data.seniorManagement === 'Yes';
  return (
    <div className="form-card">
      <div className="section-header">
        <div className="section-step-tag"><span className="step-dot"/>Section 03</div>
        <div className="section-title">Subject(s) of the Complaint</div>
        <div className="section-desc">Provide details about the person(s) the complaint is directed against. Write "Unknown" if not known.</div>
      </div>
      <div className="form-body">
        <div className="form-grid">
          <div className="field-group span-2">
            <label>Name(s) of Person(s) Involved</label>
            <input type="text" placeholder="Full names separated by commas. Write 'Unknown' if not known."
              value={data.subjectNames} onChange={e => set('subjectNames',e.target.value)}/>
          </div>
          <div className="field-group">
            <label>Designation / Role</label>
            <input type="text" placeholder="e.g. DGM – Procurement"
              value={data.subjectDesignation} onChange={e => set('subjectDesignation',e.target.value)}/>
          </div>
          <div className="field-group">
            <label>Organisation</label>
            <select value={data.subjectOrg} onChange={e => set('subjectOrg',e.target.value)}>
              <option value="">— Select —</option>
              <option>SLT</option><option>Mobitel</option><option>SLTS</option>
              <option>External / Vendor</option><option>Unknown</option>
            </select>
          </div>
          <div className="field-group span-2">
            <label>Relationship to Reporter</label>
            <div className="radio-group">
              {['Superior / Manager','Peer Colleague','Subordinate','External party','Unknown'].map(opt => (
                <label key={opt} className={`radio-option ${data.subjectRelationship===opt?'selected':''}`}>
                  <input type="radio" name="subjectRelationship" value={opt} checked={data.subjectRelationship===opt} onChange={() => set('subjectRelationship',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="field-divider"/>
          <div className="field-group span-2">
            <label>Does the Complaint Involve Senior Management or Any IAU Member? <span className="required-star">*</span></label>
            <div className="radio-group">
              {['Yes','No','Unsure'].map(opt => (
                <label key={opt} className={`radio-option ${data.seniorManagement===opt?'selected':''}`}>
                  <input type="radio" name="seniorManagement" value={opt} checked={data.seniorManagement===opt} onChange={() => set('seniorManagement',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {flagged && (
              <div className="ciaboc-flag">
                <span>⚠️</span>
                <span><strong>CIABOC Escalation Required:</strong> This submission will be automatically routed for direct escalation to CIABOC and flagged in the IAU case management system.</span>
              </div>
            )}
          </div>
          {flagged && (
            <div className="field-group span-2">
              <label>Name(s) of Senior Personnel Involved <span className="conditional-badge">conditional</span></label>
              <input type="text" placeholder="Full names of senior management or IAU members involved"
                value={data.seniorNames} onChange={e => set('seniorNames',e.target.value)}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
