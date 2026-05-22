import React from 'react';
const STEPS = ['Reporter','Complaint','Subject','Evidence','Declaration','Done'];
export default function ProgressBar({ currentStep }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-steps">
        {STEPS.map((s,i) => {
          const n=i+1, done=n<currentStep, active=n===currentStep;
          return (
            <div key={i} className={`progress-step ${done?'completed':''} ${active?'active':''}`}>
              <div className="step-circle">{done?'✓':n}</div>
              <span className="step-label">{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
