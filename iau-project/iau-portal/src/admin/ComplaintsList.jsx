import React, { useEffect, useState, useCallback } from 'react';
import { fetchComplaints } from './adminApi';
import ComplaintDetail from './ComplaintDetail';
const STATUSES=['','Submitted','Under Review','Escalated','Closed','Rejected'];
export default function ComplaintsList(){
  const [rows,setRows]=useState([]);
  const [pagination,setPag]=useState({page:1,limit:15,total:0,pages:1});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [search,setSearch]=useState('');
  const [statusFilter,setSF]=useState('');
  const [ciabocOnly,setCiaboc]=useState(false);
  const [selected,setSelected]=useState(null);
  const [page,setPage]=useState(1);
  const load=useCallback(()=>{
    setLoading(true);setError('');
    const p={page,limit:15};
    if(statusFilter)p.status=statusFilter;
    if(ciabocOnly)p.ciaboc='1';
    fetchComplaints(p).then(d=>{setRows(d.data);setPag(d.pagination);}).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[page,statusFilter,ciabocOnly]);
  useEffect(()=>{load();},[load]);
  const filtered=search?rows.filter(r=>r.crn.toLowerCase().includes(search.toLowerCase())||r.complaint_category.toLowerCase().includes(search.toLowerCase())):rows;
  const handleStatusUpdated=(crn,s)=>setRows(prev=>prev.map(r=>r.crn===crn?{...r,status:s}:r));
  return(
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">All Complaints</div>
        <div className="admin-page-sub">{pagination.total} total submissions in the system</div>
      </div>
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-table-title">Complaint Register</div>
          <div className="admin-table-controls">
            <input type="text" placeholder="Search CRN, category…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:190}}/>
            <select value={statusFilter} onChange={e=>{setSF(e.target.value);setPage(1);}}>
              <option value="">All Statuses</option>
              {STATUSES.filter(Boolean).map(s=><option key={s}>{s}</option>)}
            </select>
            <label style={{fontSize:12,display:'flex',alignItems:'center',gap:5,cursor:'pointer',fontWeight:500,padding:'6px 10px',border:'1.5px solid var(--gray-300)',borderRadius:'var(--r-md)',background:ciabocOnly?'var(--danger-light)':'var(--white)',borderColor:ciabocOnly?'var(--danger)':'var(--gray-300)',color:ciabocOnly?'#991B1B':'var(--gray-600)'}}>
              <input type="checkbox" checked={ciabocOnly} onChange={e=>{setCiaboc(e.target.checked);setPage(1);}} style={{accentColor:'var(--danger)'}}/>
              CIABOC only
            </label>
          </div>
        </div>
        {error&&<div className="alert-box danger" style={{margin:'12px 18px'}}><span className="alert-icon">⚠️</span>{error}</div>}
        <div style={{overflowX:'auto'}}>
          <table>
            <thead><tr><th>CRN</th><th>Category</th><th>Type</th><th>Reporter</th><th>Date</th><th>Status</th><th>Flag</th><th></th></tr></thead>
            <tbody>
              {loading?<tr><td colSpan={8} style={{textAlign:'center',padding:'32px 0',color:'var(--gray-400)'}}>⏳ Loading…</td></tr>
              :filtered.length===0?<tr><td colSpan={8} style={{textAlign:'center',padding:'32px 0',color:'var(--gray-400)'}}>No complaints found</td></tr>
              :filtered.map(r=>(
                <tr key={r.crn}>
                  <td style={{fontFamily:'JetBrains Mono,monospace',fontSize:11.5,color:'var(--navy)'}}>{r.crn}</td>
                  <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis'}}>{r.complaint_category}</td>
                  <td><span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:'var(--r-pill)',background:r.submission_type==='Anonymous'?'var(--gray-100)':'var(--navy-light)',color:r.submission_type==='Anonymous'?'var(--gray-500)':'var(--navy)'}}>{r.submission_type}</span></td>
                  <td style={{color:'var(--gray-500)',fontSize:12}}>{r.reporter_category}</td>
                  <td style={{fontSize:12}}>{new Date(r.submitted_at).toLocaleDateString('en-GB')}</td>
                  <td><span className={`status-badge status-${r.status.replace(/ /g,'-')}`}>{r.status}</span></td>
                  <td>{r.ciaboc_escalation===1?<span className="ciaboc-badge">CIABOC</span>:<span style={{color:'var(--gray-300)'}}>—</span>}</td>
                  <td><button className="btn-table" onClick={()=>setSelected(r.crn)}>View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <span>Showing <strong>{filtered.length}</strong> of <strong>{pagination.total}</strong></span>
          <div className="admin-pagination-btns">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>‹ Prev</button>
            {Array.from({length:Math.min(pagination.pages,7)},(_,i)=>{const p=i+1;return<button key={p} className={page===p?'active':''} onClick={()=>setPage(p)}>{p}</button>;})  }
            <button disabled={page>=pagination.pages} onClick={()=>setPage(p=>p+1)}>Next ›</button>
          </div>
        </div>
      </div>
      {selected&&<ComplaintDetail crn={selected} onClose={()=>setSelected(null)} onStatusUpdated={handleStatusUpdated}/>}
    </div>
  );
}
