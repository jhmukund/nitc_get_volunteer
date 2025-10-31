import React, { useEffect, useState } from 'react';
import { markNotificationRead } from '../api';
import { getToken } from '../auth';

export default function NotificationsPanel({ items = [] }) {
  const token = getToken();
  const [notes, setNotes] = useState(items);

  useEffect(()=>{ setNotes(items); }, [items]);

  async function markRead(id) {
    try {
      await markNotificationRead(id, token);
      setNotes(n => n.map(x => x._id === id ? { ...x, read: true } : x));
    } catch (err) { console.error(err); }
  }

  if (!notes.length) return null;
  return (
    <div className="card">
      <h4>Notifications <small>({notes.filter(n=>!n.read).length} new)</small></h4>
      <ul>
        {notes.map(n => (
          <li key={n._id} style={{opacity: n.read?0.6:1}}>
            {n.message} <small>— {new Date(n.createdAt).toLocaleString()}</small>
            {!n.read && <button style={{marginLeft:8}} onClick={()=>markRead(n._id)}>Mark read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
