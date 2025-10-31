import React, { useEffect, useState } from 'react';
import { fetchActivities, createActivity, extendDeadline, deleteActivity, listApplications, updateApplicationStatus, fetchNotifications } from '../api';
import { getToken } from '../auth';
import ActivityForm from '../components/ActivityForm';
import ApplicationList from '../components/ApplicationList';
import NotificationsPanel from '../components/NotificationsPanel';

export default function TeacherDashboard() {
  const token = getToken();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  async function load() {
    const acts = await fetchActivities(false);
    setActivities(Array.isArray(acts)?acts:[]);
    if (token) {
      const notes = await fetchNotifications(token);
      setNotifications(Array.isArray(notes)?notes:[]);
    }
  }
  useEffect(()=>{ load(); const iv=setInterval(load,20000); return ()=>clearInterval(iv); }, []);

  async function handleCreate(data) {
    const res = await createActivity(data, token);
    if (res._id) { alert('Created'); load(); } else alert(res.message || 'Error');
  }

  async function handleExtend(id) {
    const nd = prompt('New deadline (YYYY-MM-DDTHH:mm):');
    if (!nd) return;
    const res = await extendDeadline(id, nd, token);
    if (res._id) { alert('Extended'); load(); } else alert(res.message || 'Error');
  }

  async function handleDelete(id) {
    if (!confirm('Delete activity? This removes applications.')) return;
    const res = await deleteActivity(id, token);
    if (res.message) { alert(res.message); load(); } else alert(res.message || 'Error');
  }

  async function handleViewApplications(aid) {
    const res = await listApplications(aid, token);
    setApplications(Array.isArray(res)?res:[]);
    setSelectedActivity(aid);
  }

  async function handleUpdateStatus(appId, status) {
    // optimistic UI: update locally
    setApplications(prev => prev.map(p => p._id === appId ? { ...p, status } : p));
    const res = await updateApplicationStatus(appId, status, token);
    if (!res._id) alert(res.message || 'Error');
    // refresh applications
    if (selectedActivity) handleViewApplications(selectedActivity);
  }

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <NotificationsPanel items={notifications} />
      <ActivityForm onCreate={handleCreate} />
      <h3>Your Activities</h3>
      {activities.length===0 && <p>No activities yet.</p>}
      <ul>
        {activities.map(a => (
          <li key={a._id} style={{marginBottom:10}}>
            <strong>{a.title}</strong> — deadline: {new Date(a.deadline).toLocaleString()} — active: {String(a.isActive)}
            <div style={{marginTop:6}}>
              <button className="btn" onClick={()=>handleExtend(a._id)}>Extend</button>
              <button style={{marginLeft:8}} onClick={()=>handleViewApplications(a._id)}>Applications</button>
              <button style={{marginLeft:8, background:'#d9534f'}} onClick={()=>handleDelete(a._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedActivity && <ApplicationList applications={applications} onAction={handleUpdateStatus} />}
    </div>
  );
}
