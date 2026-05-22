import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import ComplaintsList from './ComplaintsList';
import AuditLog from './AuditLog';

const NAV = [
  {id:'dashboard', label:'Dashboard',  icon:'📊'},
  {id:'complaints',label:'Complaints', icon:'📋'},
  {id:'audit',     label:'Audit Log',  icon:'🔍'},
];

export default function AdminApp() {
  const [admin,setAdmin] = useState(()=>{try{return JSON.parse(localStorage.getItem('iau_admin_user'));}catch{return null;}});
  const [page,setPage]   = useState('dashboard');
  useEffect(()=>{if(!localStorage.getItem('iau_admin_token'))setAdmin(null);},[]);
  const logout = ()=>{localStorage.removeItem('iau_admin_token');localStorage.removeItem('iau_admin_user');setAdmin(null);};
  if(!admin) return <AdminLogin onLogin={u=>setAdmin(u)}/>;
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="sidebar-logo-pill"><img src="/sltmobitel-logo.png" alt="SLTMobitel"/></div>
          <div className="sidebar-accent-line"/>
          <div className="sidebar-title">IAU Admin Portal</div>
          <div className="sidebar-sub">Internal Affairs Unit</div>
        </div>
        <nav className="admin-nav">
          <div className="nav-section-label">Main Menu</div>
          {NAV.map(item=>(
            <div key={item.id} className={`admin-nav-item ${page===item.id?'active':''}`} onClick={()=>setPage(item.id)}>
              <span className="admin-nav-icon">{item.icon}</span>{item.label}
            </div>
          ))}
          <hr className="nav-sep"/>
          <div className="nav-section-label">Links</div>
          <div className="admin-nav-item" onClick={()=>window.open('/','_blank')}>
            <span className="admin-nav-icon">↗</span>Reporter Portal
          </div>
        </nav>
        <div className="admin-sidebar-footer">
          Signed in as
          <span className="sidebar-user">{admin.full_name||admin.username}</span>
          <span className="sidebar-signout" onClick={logout}>Sign out</span>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-left">
            <div className="topbar-page-title">{NAV.find(n=>n.id===page)?.label||'Admin'}</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-user-chip"><span className="topbar-user-dot"/>{admin.username}</div>
            <span className="topbar-logout" onClick={logout}>Logout</span>
          </div>
        </div>
        {page==='dashboard'  && <Dashboard/>}
        {page==='complaints' && <ComplaintsList/>}
        {page==='audit'      && <AuditLog/>}
      </div>
    </div>
  );
}
