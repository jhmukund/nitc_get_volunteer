import React, { useEffect, useState } from 'react';
import { fetchActivities, applyToActivity, fetchNotifications } from '../api';
import { getToken } from '../auth';
import ActivityCard from '../components/ActivityCard';
import NotificationsPanel from '../components/NotificationsPanel';

export default function StudentDashboard() {
  const token = getToken();
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  async function loadAll() {
    const acts = await fetchActivities(true);
    setActivities(Array.isArray(acts)?acts:[]);
    if (token) {
      const notes = await fetchNotifications(token);
      setNotifications(Array.isArray(notes)?notes:[]);
    }
  }

  useEffect(()=>{ loadAll(); const iv = setInterval(loadAll, 15000); return ()=>clearInterval(iv); }, []);

  async function handleApply(id) {
    if (!token) return alert('Please login');
    const res = await applyToActivity(id, token);
    alert(res.message || 'Applied');
    loadAll();
  }

  return (
    <div>
      <h2 className="section-title">Available Activities</h2>
      <NotificationsPanel items={notifications} />
      {activities.length===0 && <p>No active activities</p>}
      {activities.map(a => <ActivityCard key={a._id} activity={a} onApply={() => handleApply(a._id)} />)}
    </div>
  );
}
