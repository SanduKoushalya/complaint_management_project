import React, { useEffect, useState } from 'react';
import { fetchComplaint, updateStatus } from './adminApi';
const STATUSES=['Submitted','Under Review','Escalated','Closed','Rejected'];
function Row({label,value,span}){
  if(value===null||value===undefined||value==='') return null;
  return(<div className={`detail-item${span?' span-2':''}`}><label>{label}</label><p>{value}</p></div>);
}
export default function ComplaintDetail({crn,onClose,onStatusUpdated}){
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [status,setStatus]=useState('');
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const API = process.env.REACT_APP_API_URL||'http://localhost:5000/api';
  useEffect(()=>{
    fetchComplaint(crn).then(r=>{setData(r.data);setStatus(r.data.status);}).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[crn]);
  const save = async()=>{
    setSaving(true);setSaved(false);
    try{await updateStatus(crn,status);setSaved(true);if(onStatusUpdated)onStatusUpdated(crn,status);setTimeout(()=>setSaved(false),2500);}
    catch(e){setError(e.message);}finally{setSaving(false);}
  };
  const fd = d=>d?new Date(d).toLocaleDateString('en-GB'):null;
  const fdt= d=>d?new Date(d).toLocaleString('en-GB'):null;
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">Complaint — <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:13}}>{crn}</span>{data?.ciaboc_escalation===1&&<span className="ciaboc-badge" style={{marginLeft:8}}>CIABOC</span>}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading&&<p style={{color:'var(--gray-400)',padding:'20px 0'}}>⏳ Loading…</p>}
          {error&&<div className="alert-box danger"><span className="alert-icon">⚠️</span>{error}</div>}
          {data&&(
            <div className="detail-grid">
              <div className="detail-section-title">📌 Submission Info</div>
              <Row label="CRN" value={data.crn}/><Row label="Submitted" value={fdt(data.submitted_at)}/><Row label="Type" value={data.submission_type}/><Row label="Status" value={data.status}/>
              <div className="detail-section-title">👤 Reporter</div>
              <Row label="Full Name" value={data.full_name||'— Anonymous —'}/><Row label="Category" value={data.reporter_category}/><Row label="Staff ID" value={data.staff_id}/><Row label="Division" value={data.division}/><Row label="Email" value={data.contact_email}/><Row label="Tel" value={data.contact_tel}/>
              <div className="detail-section-title">📋 Complaint Details</div>
              <Row label="Category" value={data.complaint_category}/><Row label="Date From" value={fd(data.incident_date_from)}/><Row label="Date To" value={fd(data.incident_date_to)}/><Row label="Location" value={data.incident_location}/><Row label="Frequency" value={data.frequency}/><Row label="Prev. Reported" value={data.previously_reported}/>
              <div className="detail-item span-2"><label>Description</label><p style={{whiteSpace:'pre-wrap',lineHeight:1.65}}>{data.description}</p></div>
              <div className="detail-section-title">🎯 Subject(s)</div>
              <Row label="Name(s)" value={data.subject_names}/><Row label="Designation" value={data.subject_designation}/><Row label="Organisation" value={data.subject_org}/><Row label="Senior Mgmt?" value={data.involves_senior_mgmt}/><Row label="Senior Names" value={data.senior_names}/>
              <div className="detail-section-title">📎 Evidence</div>
              <Row label="Has Evidence" value={data.has_evidence}/><Row label="Types" value={data.evidence_types}/><Row label="Witnesses" value={data.witness_names}/>
              {data.additional_info&&<div className="detail-item span-2"><label>Additional Info</label><p style={{whiteSpace:'pre-wrap'}}>{data.additional_info}</p></div>}
              {data.files&&data.files.length>0&&(
                <><div className="detail-section-title">🗂 Files ({data.files.length})</div>
                <div className="detail-item span-2">{data.files.map(f=>(
                  <div key={f.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--gray-100)'}}>
                    <span style={{fontSize:13}}>📄 {f.original_name}</span>
                    <a href={`${API}/files/${f.id}`} target="_blank" rel="noreferrer" style={{fontSize:12,color:'var(--navy-mid)',fontWeight:600,textDecoration:'none'}}>Download ↗</a>
                  </div>
                ))}</div></>
              )}
            </div>
          )}
        </div>
        {data&&(
          <div className="modal-footer">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <label style={{fontSize:12,fontWeight:600,color:'var(--gray-700)'}}>Update Status:</label>
              <select className="status-select" value={status} onChange={e=>setStatus(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
              <button className="btn btn-primary" style={{padding:'7px 16px',fontSize:12.5}} onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button>
              {saved&&<span style={{fontSize:12,color:'var(--green)',fontWeight:600}}>✓ Saved</span>}
            </div>
            <button className="btn btn-secondary" style={{padding:'7px 16px',fontSize:12.5}} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
