const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('iau_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle(promise) {
  const response = await promise;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function adminLogin(username, password) {
  return handle(fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }));
}

export function fetchStats() {
  return handle(fetch(`${BASE}/stats`, { headers: getHeaders() }));
}

export function fetchComplaints(params = {}) {
  return handle(fetch(`${BASE}/complaints?${new URLSearchParams(params)}`, {
    headers: getHeaders(),
  }));
}

export function fetchComplaint(crn) {
  return handle(fetch(`${BASE}/complaints/${crn}`, { headers: getHeaders() }));
}

export function updateStatus(crn, status) {
  return handle(fetch(`${BASE}/complaints/${crn}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  }));
}

export function fetchAuditLog(params = {}) {
  return handle(fetch(`${BASE}/admin/audit-log?${new URLSearchParams(params)}`, {
    headers: getHeaders(),
  }));
}
