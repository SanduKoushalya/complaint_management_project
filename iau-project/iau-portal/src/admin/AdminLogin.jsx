import React, { useState } from 'react';
import { adminLogin } from './adminApi';
export default function AdminLogin({ onLogin }) {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const submit = async () => {
    if(!username||!password){setError('Please enter your username and password.');return;}
    setLoading(true);setError('');
    try{
      const d=await adminLogin(username,password);
      localStorage.setItem('iau_admin_token',d.token);
      localStorage.setItem('iau_admin_user',JSON.stringify(d.admin));
      onLogin(d.admin);
    }catch(e){setError(e.message||'Invalid credentials.');}
    finally{setLoading(false);}
  };
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-card-body">
          <div className="admin-login-logo">
            <div className="login-logo-wrap"><img src="/sltmobitel-logo.png" alt="SLTMobitel"/></div>
          </div>
          <div className="admin-login-title">IAU Admin Portal</div>
          <div className="admin-login-sub">Internal Affairs Unit — Authorised Access Only</div>
          {error && <div className="login-error"><span>⚠️</span><span>{error}</span></div>}
          <div className="login-field">
            <label>Username</label>
            <input type="text" placeholder="Enter username" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} autoFocus/>
          </div>
          <div className="login-field">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
          </div>
          <button className="btn-login" onClick={submit} disabled={loading}>{loading?'⏳ Signing in…':'Sign In →'}</button>
        </div>
        <div className="login-footer">
          This system is monitored. Unauthorised access is prohibited.<br/>
          SLTMobitel IAU · CONFIDENTIAL
        </div>
      </div>
    </div>
  );
}
