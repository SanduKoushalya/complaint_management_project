import React from 'react';
export default function Section5({ data, onChange }) {
  const set = (f,v) => onChange({ ...data, [f]:v });
  return (
    <div className="form-card">
      <div className="section-header">
        <div className="section-step-tag"><span className="step-dot"/>Section 05</div>
        <div className="section-title">Declaration &amp; Submission</div>
        <div className="section-desc">Read the declaration carefully and confirm your agreement before submitting.</div>
      </div>
      <div className="form-body">
        <div className="declaration-block">
          "I hereby confirm that the information provided is, to the best of my knowledge, true and accurate.
          I understand that deliberate or malicious false reports are treated seriously and may result in
          disciplinary action. I acknowledge that the IAU will treat this
          submission with strict confidentiality and that no retaliation will be taken against me for raising
          a genuine concern."
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:22}}>
          <label className={`checkbox-option ${data.decl1?'selected':''}`} style={{alignItems:'flex-start'}}>
            <input type="checkbox" checked={!!data.decl1} onChange={e=>set('decl1',e.target.checked)} style={{marginTop:3}}/>
            <span>I confirm the above declaration and consent to the IAU processing my submission for investigation purposes.<strong style={{color:'var(--danger)'}}> (Required)</strong></span>
          </label>
          <label className={`checkbox-option ${data.decl2?'selected':''}`} style={{alignItems:'flex-start'}}>
            <input type="checkbox" checked={!!data.decl2} onChange={e=>set('decl2',e.target.checked)} style={{marginTop:3}}/>
            <span>I understand that this portal is monitored and all submissions are logged for audit purposes.<strong style={{color:'var(--danger)'}}> (Required)</strong></span>
          </label>
        </div>
        <div style={{border:'1.5px solid var(--gray-300)',borderRadius:'var(--r-md)',padding:'14px 18px',background:'var(--gray-50)',display:'flex',alignItems:'center',gap:14,maxWidth:300}}>
          <label className={`checkbox-option ${data.captcha?'selected':''}`} style={{border:'none',padding:0,background:'none'}}>
            <input type="checkbox" checked={!!data.captcha} onChange={e=>set('captcha',e.target.checked)}/>
            <span style={{fontWeight:500,fontSize:13}}>I'm not a robot</span>
          </label>
          <div style={{marginLeft:'auto',textAlign:'center'}}>
            <div style={{fontSize:22}}>🔒</div>
            <div style={{fontSize:8.5,color:'var(--gray-400)',lineHeight:1.3}}>reCAPTCHA<br/>Privacy · Terms</div>
          </div>
        </div>
        <div className="alert-box info" style={{marginTop:18}}>
          <span className="alert-icon">🛡️</span>
          <div><strong>Data Protection Notice:</strong> Your submission will be encrypted at rest (AES-256) and in transit (TLS 1.2+). Retained for a minimum of 7 years per Sri Lanka's data protection requirements.</div>
        </div>
      </div>
    </div>
  );
}
