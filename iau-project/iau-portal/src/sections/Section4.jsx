import React, { useRef } from 'react';

const EVIDENCE_TYPES = ['Documents / Records','Email or Communication','Photographs','Videos','Witness testimony','Financial records','Other'];
const ACCEPTED = new Set(['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png']);
const MAX_SIZE = 10*1024*1024, MAX_FILES = 5;
const fmt = b => b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB';

export default function Section4({ data, onChange, onFileObjectsChange }) {
  const set = (f,v) => onChange({ ...data, [f]:v });
  const fileRef = useRef(), objsRef = useRef([]);
  const has = data.hasEvidence === 'Yes';

  const toggleType = t => {
    const cur = data.evidenceTypes||[];
    set('evidenceTypes', cur.includes(t)?cur.filter(x=>x!==t):[...cur,t]);
  };

  const handleFiles = e => {
    const newFiles = Array.from(e.target.files||[]);
    const meta=[...(data.files||[])], objs=[...objsRef.current], errs=[];
    for(const f of newFiles){
      if(!ACCEPTED.has(f.type)){errs.push(`${f.name}: unsupported type.`);continue;}
      if(f.size>MAX_SIZE){errs.push(`${f.name}: exceeds 10 MB.`);continue;}
      if(meta.length>=MAX_FILES){errs.push(`Max ${MAX_FILES} files allowed.`);break;}
      meta.push({name:f.name,size:f.size,type:f.type}); objs.push(f);
    }
    objsRef.current=objs;
    if(onFileObjectsChange) onFileObjectsChange(objs);
    onChange({...data,files:meta,fileErrors:errs});
    if(e.target) e.target.value='';
  };

  const removeFile = i => {
    const m=(data.files||[]).filter((_,j)=>j!==i);
    objsRef.current=objsRef.current.filter((_,j)=>j!==i);
    if(onFileObjectsChange) onFileObjectsChange(objsRef.current);
    onChange({...data,files:m});
  };

  return (
    <div className="form-card">
      <div className="section-header">
        <div className="section-step-tag"><span className="step-dot"/>Section 04</div>
        <div className="section-title">Supporting Evidence</div>
        <div className="section-desc">Upload any documents or records that support your complaint. All files are encrypted at rest (AES-256).</div>
      </div>
      <div className="form-body">
        <div className="form-grid">
          <div className="field-group span-2">
            <label>Do You Have Supporting Evidence? <span className="required-star">*</span></label>
            <div className="radio-group">
              {['Yes','No'].map(opt=>(
                <label key={opt} className={`radio-option ${data.hasEvidence===opt?'selected':''}`}>
                  <input type="radio" name="hasEvidence" value={opt} checked={data.hasEvidence===opt} onChange={()=>set('hasEvidence',opt)}/>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {has && (
            <div className="field-group span-2">
              <label>Evidence Type <span className="conditional-badge">conditional</span></label>
              <div className="radio-group">
                {EVIDENCE_TYPES.map(t=>(
                  <label key={t} className={`checkbox-option ${(data.evidenceTypes||[]).includes(t)?'selected':''}`}>
                    <input type="checkbox" checked={(data.evidenceTypes||[]).includes(t)} onChange={()=>toggleType(t)}/>
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {has && (
            <div className="field-group span-2">
              <label>File Upload</label>
              <div className={`file-upload-area ${(data.files||[]).length>0?'has-files':''}`}
                onClick={()=>fileRef.current.click()}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();handleFiles({target:{files:e.dataTransfer.files}});}}>
                <div className="file-upload-icon">📎</div>
                <div className="file-upload-text">
                  <strong>Click to upload</strong> or drag and drop<br/>
                  PDF, DOCX, JPG, PNG · Max 10 MB · Up to 5 files
                </div>
                <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={handleFiles} style={{display:'none'}}/>
              </div>
              {(data.fileErrors||[]).length>0 && (
                <div style={{marginTop:6}}>{data.fileErrors.map((e,i)=><div key={i} className="field-error">⚠️ {e}</div>)}</div>
              )}
              {(data.files||[]).length>0 && (
                <div className="file-list">
                  {data.files.map((f,i)=>(
                    <div key={i} className="file-item">
                      <span className="file-item-name">📄 {f.name}</span>
                      <span className="file-item-size">{fmt(f.size)}</span>
                      <button className="file-item-remove" onClick={()=>removeFile(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="alert-box info" style={{marginTop:10}}>
                <span className="alert-icon">🔒</span>
                <span>Files are encrypted at rest (AES-256) and accessible only to authorised IAU panel members.</span>
              </div>
            </div>
          )}

          <hr className="field-divider"/>

          <div className="field-group span-2">
            <label>Names of Witness(es)</label>
            <input type="text" placeholder="Separate multiple names with commas"
              value={data.witnesses} onChange={e=>set('witnesses',e.target.value)}/>
            <span className="field-hint">Witness names are kept strictly confidential by the IAU.</span>
          </div>

          <div className="field-group span-2">
            <label>Additional Information</label>
            <textarea rows={3} placeholder="Any other context, related incidents, or supplementary information."
              value={data.additionalInfo} onChange={e=>set('additionalInfo',e.target.value)}/>
          </div>
        </div>
      </div>
    </div>
  );
}
