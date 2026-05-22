import React, { useEffect, useState, useCallback } from 'react';
import { fetchAuditLog } from './adminApi';
const EVT={SUBMISSION:{bg:'var(--navy-light)',color:'var(--navy)'},COMPLAINT_VIEW:{bg:'#F3E8FF',color:'#6B21A8'},FILE_DOWNLOAD:{bg:'var(--green-light)',color:'var(--green-dark)'},STATUS_CHANGE:{bg:'var(--warning-light)',color:'#92400E'},ADMIN_LOGIN:{bg:'var(--cyan-light)',color:'var(--cyan-dark)'},ADMIN_LOGIN_FAIL:{bg:'var(--danger-light)',color:'#991B1B'}};
export default function AuditLog(){
  const [rows,setRows]=useState([]);
  const [pagination,setPag]=useState({page:1,total:0,pages:1});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [page,setPage]=useState(1);
  const load=useCallback(()=>{setLoading(true);setError('');fetchAuditLog({page,limit:20}).then(d=>{setRows(d.data);setPag(d.pagination);}).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[page]);
  useEffect(()=>{load();},[load]);
  return(
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Audit Log</div>
        <div className="admin-page-sub">Complete system event history — {pagination.total} total entries</div>
      </div>
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-table-title">System Event Log</div>
          <div style={{fontSize:11,color:'var(--gray-400)',background:'var(--gray-100)',border:'1px solid var(--gray-200)',borderRadius:'var(--r-pill)',padding:'3px 10px',fontWeight:500}}>🔒 Immutable · Read-Only</div>
        </div>
        {error&&<div className="alert-box danger" style={{margin:'12px 18px'}}><span className="alert-icon">⚠️</span>{error}</div>}
        <div style={{overflowX:'auto'}}>
          <table>
            <thead><tr><th>Time</th><th>Event</th><th>CRN</th><th>Actor</th><th>Description</th></tr></thead>
            <tbody>
              {loading?<tr><td colSpan={5} style={{textAlign:'center',padding:'32px 0',color:'var(--gray-400)'}}>⏳ Loading…</td></tr>
              :rows.length===0?<tr><td colSpan={5} style={{textAlign:'center',padding:'32px 0',color:'var(--gray-400)'}}>No log entries</td></tr>
              :rows.map(r=>{const s=EVT[r.event_type]||{bg:'var(--gray-100)',color:'var(--gray-600)'};return(
                <tr key={r.id}>
                  <td style={{fontSize:11.5,whiteSpace:'nowrap',color:'var(--gray-500)'}}>{new Date(r.occurred_at).toLocaleString('en-GB')}</td>
                  <td><span style={{background:s.bg,color:s.color,fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:'var(--r-pill)',whiteSpace:'nowrap'}}>{r.event_type}</span></td>
                  <td style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'var(--navy)'}}>{r.crn||'—'}</td>
                  <td style={{fontSize:12,fontWeight:500}}>{r.actor||'—'}</td>
                  <td style={{fontSize:12,color:'var(--gray-600)',maxWidth:320,overflow:'hidden',textOverflow:'ellipsis'}}>{r.description||'—'}</td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <span>Page <strong>{page}</strong> of <strong>{pagination.pages}</strong> · {pagination.total} events</span>
          <div className="admin-pagination-btns">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>‹ Prev</button>
            <button disabled={page>=pagination.pages} onClick={()=>setPage(p=>p+1)}>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
