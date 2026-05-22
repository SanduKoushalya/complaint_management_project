import React, { useEffect, useState } from 'react';
import { fetchStats } from './adminApi';
function StatCard({value,label,icon,variant}){
  return(<div className={`stat-card ${variant}`}><div className="stat-card-top-bar"/><div className="stat-card-icon-bg">{icon}</div><div className="stat-card-value">{value??'—'}</div><div className="stat-card-label">{label}</div></div>);
}
export default function Dashboard() {
  const [stats,setStats]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{fetchStats().then(setStats).catch(e=>setError(e.message)).finally(()=>setLoading(false));}, []);
  if(loading) return <div style={{padding:32,color:'var(--gray-400)'}}>⏳ Loading…</div>;
  if(error)   return <div className="alert-box danger" style={{margin:24}}><span className="alert-icon">⚠️</span>{error}</div>;
  const t=stats?.totals||{};
  const byCat=stats?.byCategory||[], recent=stats?.recentSubmissions||[];
  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Dashboard</div>
        <div className="admin-page-sub">Overview of all complaint submissions to the IAU</div>
      </div>
      <div className="stat-grid">
        <StatCard value={t.total}               label="Total Submissions"   icon="📋" variant="sc-blue"/>
        <StatCard value={t.status_submitted}    label="Awaiting Review"     icon="🔵" variant="sc-cyan"/>
        <StatCard value={t.status_under_review} label="Under Review"        icon="🔍" variant="sc-amber"/>
        <StatCard value={t.ciaboc_flagged}      label="CIABOC Flagged"      icon="⚠️" variant="sc-red"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
        <StatCard value={t.status_closed}   label="Closed"                icon="✅" variant="sc-green"/>
        <StatCard value={t.anonymous_count} label="Anonymous Submissions"  icon="👤" variant="sc-blue"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="admin-table-card">
          <div className="admin-table-header"><div className="admin-table-title">By Category</div></div>
          <table><thead><tr><th>Category</th><th style={{textAlign:'right'}}>Count</th></tr></thead>
          <tbody>{byCat.length===0
            ?<tr><td colSpan={2} style={{textAlign:'center',padding:'24px 0',color:'var(--gray-400)'}}>No data yet</td></tr>
            :byCat.map((r,i)=><tr key={i}><td>{r.category}</td><td style={{textAlign:'right',fontWeight:700,color:'var(--navy)'}}>{r.count}</td></tr>)
          }</tbody></table>
        </div>
        <div className="admin-table-card">
          <div className="admin-table-header"><div className="admin-table-title">Recent Submissions</div></div>
          <table><thead><tr><th>CRN</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>{recent.length===0
            ?<tr><td colSpan={3} style={{textAlign:'center',padding:'24px 0',color:'var(--gray-400)'}}>No submissions yet</td></tr>
            :recent.map((r,i)=><tr key={i}><td style={{fontFamily:'JetBrains Mono,monospace',fontSize:11}}>{r.crn}</td><td style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis'}}>{r.complaint_category}</td><td><span className={`status-badge status-${r.status.replace(/ /g,'-')}`}>{r.status}</span></td></tr>)
          }</tbody></table>
        </div>
      </div>
    </div>
  );
}
