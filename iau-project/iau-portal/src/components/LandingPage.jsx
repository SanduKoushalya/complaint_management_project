import React, { useState } from 'react';

export default function LandingPage({ onNavigate }) {
  const [hovered, setHovered] = useState(null);

  const cards = [
    {
      id: 'portal',
      icon: (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <rect x="4" y="4" width="26" height="26" rx="4" stroke="white" strokeWidth="1.8" strokeDasharray="0"/>
          <path d="M10 12h14M10 17h14M10 22h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="27" cy="27" r="6" fill="#4CB748"/>
          <path d="M24.5 27l1.5 1.5L29 25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'REPORTING',
      title: 'Submit a Complaint',
      desc: 'Report concerns of bribery, corruption, fraud, or malpractice securely and confidentially. Both named and anonymous submissions are supported.',
      action: 'Start Reporting',
      accent: '#00B5E2',
      glow: 'rgba(0,181,226,0.22)',
      border: 'rgba(0,181,226,0.35)',
      tag: 'Anonymous Supported',
      tagColor: '#4CB748',
    },
    {
      id: 'track',
      icon: (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <circle cx="15" cy="15" r="9" stroke="white" strokeWidth="1.8"/>
          <path d="M22 22l6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11 15h8M15 11v8" stroke="#4CB748" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      label: 'TRACKING',
      title: 'Track Your Complaint',
      desc: 'Already submitted? Enter your Complaint Reference Number (CRN) to instantly check the current status and progress of your submission.',
      action: 'Check Status',
      accent: '#4CB748',
      glow: 'rgba(76,183,72,0.20)',
      border: 'rgba(76,183,72,0.35)',
      tag: 'Real-time Status',
      tagColor: '#00B5E2',
    },
    {
      id: 'admin',
      icon: (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="12" r="5" stroke="white" strokeWidth="1.8"/>
          <path d="M7 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="26" cy="8" r="4" fill="#00B5E2"/>
          <path d="M24.5 8h3M26 6.5v3" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      label: 'ADMINISTRATION',
      title: 'Admin Portal',
      desc: 'Authorised IAU staff only. Access the case management dashboard to review submissions, update statuses, and monitor the system audit log.',
      action: 'Staff Login',
      accent: 'rgba(255,255,255,0.55)',
      glow: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.15)',
      tag: 'IAU Staff Only',
      tagColor: 'rgba(255,255,255,0.45)',
    },
  ];

  return (
    <div className="lp-root">
      <div
        className="lp-bg"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/landing-bg.png)` }}
      />
      <div className="lp-overlay" />

      <div className="lp-content">

        <div className="lp-topbar">
          <div className="lp-topbar-left">
            <div className="lp-logo-pill">
              <img
                src={`${process.env.PUBLIC_URL}/sltmobitel-logo.png`}
                alt="SLTMobitel"
                className="lp-logo"
              />
            </div>
            <div className="lp-topbar-divider" />
            <div>
              <div className="lp-topbar-org">Sri Lanka Telecom PLC (SLTMobitel)</div>
              <div className="lp-topbar-unit">Internal Affairs Unit (IAU)</div>
            </div>
          </div>
          <div className="lp-topbar-right" />
        </div>

        <div className="lp-hero">
          <div className="lp-hero-left">
            <div className="lp-hero-tag">
              <span className="lp-hero-tag-dot" />
              Secure · Confidential · Encrypted
            </div>
            <h1 className="lp-hero-title">
              Complaint &amp;<br />
              Concern Reporting<br />
              <span className="lp-hero-title-green">Portal</span>
            </h1>
            <p className="lp-hero-desc">
              A trusted platform for all SLTMobitel stakeholders to report concerns of bribery, corruption,
              fraud, and malpractice. All submissions are processed under strict confidentiality.
            </p>
          </div>
        </div>

        <div className="lp-cards">
          {cards.map(card => (
            <div
              key={card.id}
              className={`lp-card ${hovered === card.id ? 'lp-card-hovered' : ''}`}
              style={{
                '--card-accent':  card.accent,
                '--card-glow':    card.glow,
                '--card-border':  card.border,
              }}
              onClick={() => onNavigate(card.id)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="lp-card-topline" />
              <div className="lp-card-header">
                <span className="lp-card-label">{card.label}</span>
                <div className="lp-card-icon">{card.icon}</div>
              </div>
              <div className="lp-card-title">{card.title}</div>
              <div className="lp-card-desc">{card.desc}</div>
              <div className="lp-card-tag" style={{ color: card.tagColor, borderColor: card.tagColor }}>
                {card.tag}
              </div>
              <div className="lp-card-footer">
                <span className="lp-card-action">{card.action}</span>
                <div className="lp-card-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="lp-card-glow-corner" />
            </div>
          ))}
        </div>

        <div className="lp-footer">
          <div className="lp-footer-left" />
          <div className="lp-footer-right" />
        </div>

      </div>
    </div>
  );
}