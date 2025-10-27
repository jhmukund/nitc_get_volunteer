const API_BASE = '/api';

function authHeader(token) { return token ? { Authorization: `Bearer ${token}` } : {}; }

export async function register(data) {
  const r = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  }); return r.json();
}
export async function login(email, password) {
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
  }); return r.json();
}

export async function fetchActivities(onlyActive = true) {
  const q = onlyActive ? '?active=true' : '';
  const r = await fetch(`${API_BASE}/activities${q}`);
  return r.json();
}
export async function createActivity(payload, token) {
  const r = await fetch(`${API_BASE}/activities`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader(token) }, body: JSON.stringify(payload)
  }); return r.json();
}
export async function extendDeadline(activityId, newDeadline, token) {
  const r = await fetch(`${API_BASE}/activities/${activityId}/extend-deadline`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader(token) }, body: JSON.stringify({ newDeadline })
  }); return r.json();
}
export async function deleteActivity(activityId, token) {
  const r = await fetch(`${API_BASE}/activities/${activityId}`, {
    method: 'DELETE', headers: { ...authHeader(token) }
  }); return r.json();
}

export async function applyToActivity(activityId, token) {
  const r = await fetch(`${API_BASE}/applications/${activityId}/apply`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader(token) }
  }); return r.json();
}
export async function listApplications(activityId, token) {
  const r = await fetch(`${API_BASE}/applications/${activityId}`, { headers: authHeader(token) });
  return r.json();
}
export async function updateApplicationStatus(applicationId, status, token) {
  const r = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader(token) }, body: JSON.stringify({ status })
  }); return r.json();
}

export async function fetchNotifications(token) {
  const r = await fetch(`${API_BASE}/notifications`, { headers: authHeader(token) });
  return r.json();
}
export async function markNotificationRead(id, token) {
  const r = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST', headers: authHeader(token) });
  return r.json();
}
