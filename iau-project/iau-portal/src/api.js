const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function submitComplaint(formData, fileObjects = []) {
  const fd = new FormData();
  fd.append('submissionType',       formData.submissionType);
  fd.append('reporterCategory',     formData.reporterCategory);
  fd.append('fullName',             formData.fullName             || '');
  fd.append('staffId',              formData.staffId              || '');
  fd.append('division',             formData.division             || '');
  fd.append('reporterDesignation',  formData.designation          || '');
  fd.append('contactEmail',         formData.contactEmail         || '');
  fd.append('contactTel',           formData.contactTel           || '');
  fd.append('preferredContact',     formData.preferredContact     || '');
  fd.append('category',             formData.category);
  fd.append('dateFrom',             formData.dateFrom);
  fd.append('dateTo',               formData.dateTo               || '');
  fd.append('location',             formData.location);
  fd.append('frequency',            formData.frequency);
  fd.append('description',          formData.description);
  fd.append('awarenessMethod',      formData.awarenessMethod);
  fd.append('previouslyReported',   formData.previouslyReported);
  fd.append('previousReportDetails',formData.previousReportDetails || '');
  fd.append('subjectNames',         formData.subjectNames         || '');
  fd.append('subjectDesignation',   formData.subjectDesignation   || '');
  fd.append('subjectOrg',           formData.subjectOrg           || '');
  fd.append('subjectRelationship',  formData.subjectRelationship  || '');
  fd.append('seniorManagement',     formData.seniorManagement);
  fd.append('seniorNames',          formData.seniorNames          || '');
  fd.append('hasEvidence',          formData.hasEvidence);
  fd.append('evidenceTypes',        JSON.stringify(formData.evidenceTypes || []));
  fd.append('witnesses',            formData.witnesses            || '');
  fd.append('additionalInfo',       formData.additionalInfo       || '');
  fileObjects.forEach(f => fd.append('files', f));

  const res  = await fetch(`${BASE}/complaints`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors
      ? data.errors.map(e => e.message).join(', ')
      : (data.message || 'Submission failed.');
    throw new Error(msg);
  }
  return data;
}

export async function trackComplaint(crn) {
  const res  = await fetch(`${BASE}/complaints/track/${crn.trim().toUpperCase()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Complaint not found.');
  return data;
}
