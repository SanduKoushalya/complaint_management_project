import React, { useState, useRef } from 'react';
import LandingPage from './components/LandingPage';
import ProgressBar from './components/ProgressBar';
import TrackComplaint from './components/TrackComplaint';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import AdminApp from './admin/AdminApp';
import { submitComplaint } from './api';

const initialState = {
  submissionType:'Named', reporterCategory:'', fullName:'', staffId:'',
  division:'', designation:'', contactEmail:'', contactTel:'', preferredContact:'',
  category:'', dateFrom:'', dateTo:'', location:'', frequency:'',
  description:'', awarenessMethod:'', previouslyReported:'', previousReportDetails:'',
  subjectNames:'', subjectDesignation:'', subjectOrg:'', subjectRelationship:'',
  seniorManagement:'', seniorNames:'',
  hasEvidence:'', evidenceTypes:[], files:[], fileErrors:[], witnesses:'', additionalInfo:'',
  decl1:false, decl2:false, captcha:false,
};

function validateSection(step, d) {
  switch(step) {
    case 1: return d.submissionType && d.reporterCategory;
    case 2: return d.category && d.dateFrom && d.location && d.frequency &&
      d.description && d.description.length >= 50 && d.awarenessMethod && d.previouslyReported;
    case 3: return d.seniorManagement;
    case 4: return d.hasEvidence;
    case 5: return d.decl1 && d.decl2 && d.captcha;
    default: return true;
  }
}

export default function App() {
  // Admin has its own full-page app
  if (window.location.pathname.startsWith('/admin')) return <AdminApp />;

  // view: 'landing' | 'portal' | 'track'
  const [view, setView]               = useState('landing');
  const [step, setStep]               = useState(1);
  const [formData, setFormData]       = useState(initialState);
  const [crn, setCrn]                 = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedForm, setSubmittedForm] = useState(null);
  const fileObjectsRef                = useRef([]);
  const canAdvance                    = validateSection(step, formData);
  const scrollTop                     = () => window.scrollTo({ top:0, behavior:'smooth' });

  // Landing card navigation
  const handleNavigate = (dest) => {
    if (dest === 'admin') { window.location.href = '/admin'; return; }
    setView(dest);
    scrollTop();
  };

  const next = () => { if (step < 5) { setStep(s=>s+1); scrollTop(); } else handleSubmit(); };
  const prev = () => { if (step > 1) { setStep(s=>s-1); scrollTop(); } };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError('');
    try {
      const r = await submitComplaint(formData, fileObjectsRef.current);
      setSubmittedForm({ ...formData });
      setCrn(r.crn); setSubmittedAt(r.submittedAt);
      setStep(6); scrollTop();
    } catch(e) {
      setSubmitError(e.message || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  const handleReset = () => {
    setFormData(initialState); setCrn(''); setSubmittedAt('');
    setSubmitError(''); setSubmittedForm(null);
    fileObjectsRef.current = []; setStep(1);
    setView('landing'); scrollTop();
  };

  // ── Landing Page ───────────────────────────────────────────
  if (view === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // ── Track Page ─────────────────────────────────────────────
  if (view === 'track') {
    return (
      <div>
        <header className="portal-header">
          <div className="portal-header-inner">
            <div className="header-logo-wrap">
              <img src="/sltmobitel-logo.png" alt="SLTMobitel" className="header-logo-img" />
            </div>
            <div className="header-divider" />
            <div className="portal-header-text">
              <span className="org-name">Sri Lanka Telecom PLC (SLTMobitel)</span>
              <span className="unit-name">Internal Affairs Unit — Complaint Tracker</span>
            </div>
            <button className="btn btn-secondary"
              style={{ fontSize:12, padding:'6px 14px', marginLeft:12 }}
              onClick={() => { setView('landing'); scrollTop(); }}>
              ← Back to Home
            </button>
          </div>
        </header>
        <div className="portal-layout" style={{ maxWidth:700 }}>
          <TrackComplaint />
        </div>
        <footer className="portal-footer">
          SLTMobitel IAU · Complaint Tracker · CONFIDENTIAL
        </footer>
      </div>
    );
  }

  // ── Reporter Portal ────────────────────────────────────────
  const sp = { data:formData, onChange:setFormData };
  return (
    <div>
      <header className="portal-header">
        <div className="portal-header-inner">
          <div className="header-logo-wrap">
            <img src="/sltmobitel-logo.png" alt="SLTMobitel" className="header-logo-img" />
          </div>
          <div className="header-divider" />
          <div className="portal-header-text">
            <span className="org-name">Sri Lanka Telecom PLC (SLTMobitel)</span>
            <span className="unit-name">Internal Affairs Unit — Complaint Portal</span>
          </div>
          <div className="header-confidential-tag">
            <span className="dot" />Confidential
          </div>
          {step < 6 && (
            <button className="btn btn-secondary"
              style={{ fontSize:12, padding:'6px 14px', marginLeft:12 }}
              onClick={() => { setView('landing'); scrollTop(); }}>
              ← Home
            </button>
          )}
        </div>
      </header>

      <div className="portal-layout">
        {/* ── Hero ── */}
        {step < 6 && (
          <div className="portal-hero">
            <div className="hero-row-top">
              <div className="portal-hero-title">
                Complaint &amp; Concern<br />
                <span className="accent">Reporting Portal</span>
              </div>
              <div className="hero-ref-pill">SLT-IAU-PORTAL-SPEC-001 v1.0</div>
            </div>
            <div className="hero-rule" />
            <div className="portal-hero-desc">
              A secure and confidential channel to report concerns of bribery, corruption,
              fraud, and malpractice within SLTMobitel Group. All submissions are processed
              under strict confidentiality.
            </div>
            <div className="hero-tags">
              <span className="hero-tag hero-tag-red">🔒 Confidential</span>
              <span className="hero-tag hero-tag-green">🛡 Anonymous Supported</span>
              <span className="hero-tag hero-tag-cyan">⚡ Encrypted</span>
            </div>
          </div>
        )}

        {/* ── Progress ── */}
        {step < 6 && <ProgressBar currentStep={step} />}

        {/* ── Sections ── */}
        {step === 1 && <Section1 {...sp} />}
        {step === 2 && <Section2 {...sp} />}
        {step === 3 && <Section3 {...sp} />}
        {step === 4 && <Section4 {...sp} onFileObjectsChange={f => { fileObjectsRef.current = f; }} />}
        {step === 5 && <Section5 {...sp} />}
        {step === 6 && (
          <Section6
            crn={crn}
            submittedAt={submittedAt}
            formData={submittedForm}
            onReset={handleReset}
          />
        )}

        {/* ── Navigation ── */}
        {step < 6 && (
          <div className="form-nav">
            <div>{step > 1 && <button className="btn btn-secondary" onClick={prev}>← Back</button>}</div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
              {submitError && (
                <div className="alert-box danger" style={{ maxWidth:400 }}>
                  <span className="alert-icon">⚠️</span><span>{submitError}</span>
                </div>
              )}
              {!canAdvance && (
                <span style={{ fontSize:11.5, color:'var(--gray-400)' }}>
                  Complete all required fields to continue
                </span>
              )}
              {step < 5
                ? <button className="btn btn-primary" onClick={next} disabled={!canAdvance}>Continue →</button>
                : <button className="btn btn-submit" onClick={next} disabled={!canAdvance||submitting}>
                    {submitting ? '⏳ Submitting…' : '✓ Submit Complaint'}
                  </button>
              }
            </div>
          </div>
        )}
      </div>

        <footer className="portal-footer">
          SLTMobitel IAU · Complaint &amp; Concern Reporting Portal · SLT-IAU-PORTAL-SPEC-001 v1.0<br />
        CONFIDENTIAL · © {new Date().getFullYear()} Sri Lanka Telecom PLC
      </footer>
    </div>
  );
}
