import React from 'react';

export default function Section1({ data, onChange }) {
  const set = (f,v) => onChange({ ...data, [f]:v });
  const isAnon = data.submissionType === 'Anonymous';

  return (
    <div className="form-card">
      <div className="section-header">
        <div className="section-step-tag"><span className="step-dot"/>Section 01</div>
        <div className="section-title">Reporter Information</div>
        <div className="section-desc">Provide your details to help the IAU follow up on your submission. Anonymous reports are also accepted.</div>
      </div>
      <div className="form-body">
        <div className="form-grid">

          <div className="field-group span-2">
            <label>Submission Type <span className="required-star">*</span></label>
            <div className="radio-group">
              {['Named','Anonymous'].map(opt => (
                <label key={opt} className={`radio-option ${data.submissionType===opt?'selected':''}`}>
                  <input type="radio" name="submissionType" value={opt}
                    checked={data.submissionType===opt} onChange={() => set('submissionType',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {isAnon && (
              <div className="alert-box info" style={{marginTop:8}}>
                <span className="alert-icon">ℹ️</span>
                <span>Anonymous submissions are accepted. A Complaint Reference Number (CRN) will be shown on screen for your records.</span>
              </div>
            )}
          </div>

          <div className="field-group span-2">
            <label>Reporter Category <span className="required-star">*</span></label>
            <select value={data.reporterCategory} onChange={e => set('reporterCategory',e.target.value)}>
              <option value="">— Select category —</option>
              <option>Employee – SLT</option>
              <option>Employee – Mobitel</option>
              <option>Employee – SLTS</option>
              <option>Vendor / Supplier / Contractor</option>
              <option>Customer</option>
              <option>Shareholder / Investor</option>
              <option>General Public</option>
              <option>Other</option>
            </select>
          </div>

          <hr className="field-divider"/>

          <div className="field-group">
            <label>Full Name {!isAnon && <span className="required-star">*</span>}{isAnon && <span className="conditional-badge">disabled</span>}</label>
            <input type="text" placeholder="Your full legal name" value={isAnon?'':data.fullName} disabled={isAnon} onChange={e => set('fullName',e.target.value)}/>
          </div>

          <div className="field-group">
            <label>Employee / Staff ID {isAnon && <span className="conditional-badge">disabled</span>}</label>
            <input type="text" placeholder="e.g. SLT-00123" value={isAnon?'':data.staffId} disabled={isAnon} onChange={e => set('staffId',e.target.value)}/>
          </div>

          <div className="field-group">
            <label>Division / Department</label>
            <input type="text" placeholder="e.g. Procurement Unit" value={data.division} onChange={e => set('division',e.target.value)}/>
          </div>

          <div className="field-group">
            <label>Designation</label>
            <input type="text" placeholder="e.g. Senior Engineer" value={data.designation} onChange={e => set('designation',e.target.value)}/>
          </div>

          <hr className="field-divider"/>

          <div className="field-group">
            <label>Contact Email {isAnon && <span className="conditional-badge">disabled</span>}</label>
            <input type="email" placeholder="your@email.com" value={isAnon?'':data.contactEmail} disabled={isAnon} onChange={e => set('contactEmail',e.target.value)}/>
            {!isAnon && <span className="field-hint">Used to send your CRN acknowledgement.</span>}
          </div>

          <div className="field-group">
            <label>Contact Telephone {isAnon && <span className="conditional-badge">disabled</span>}</label>
            <input type="tel" placeholder="+94 77 123 4567" value={isAnon?'':data.contactTel} disabled={isAnon} onChange={e => set('contactTel',e.target.value)}/>
          </div>

          <div className="field-group span-2">
            <label>Preferred Contact Method {isAnon && <span className="conditional-badge">disabled</span>}</label>
            <div className="radio-group">
              {['Email','Phone','No contact preferred'].map(opt => (
                <label key={opt} className={`radio-option ${data.preferredContact===opt?'selected':''}`} style={isAnon?{opacity:0.4,pointerEvents:'none'}:{}}>
                  <input type="radio" name="preferredContact" value={opt} checked={data.preferredContact===opt} onChange={() => set('preferredContact',opt)} disabled={isAnon}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
