import React, { useEffect, useState } from 'react';
import { markNotificationRead } from '../api';
import { getToken } from '../auth';

export default function NotificationsPanel({ items = [] }) {
  const token = getToken();
  const [notes, setNotes] = useState(items);

  useEffect(() => { setNotes(items); }, [items]);

  async function markRead(id) {
    try {
      await markNotificationRead(id, token);
      setNotes(n => n.map(x => x._id === id ? { ...x, read: true } : x));
    } catch (err) { console.error(err); }
  }

  if (!notes.length) return null;
  const unread = notes.filter(n => !n.read).length;
  return (
    <div className="card hoverable">
      <div className="space-between" style={{ marginBottom: 6 }}>
        <h4 style={{ margin: 0 }}>Notifications</h4>
        <span className="badge">{unread} new</span>
      </div>
      <ul>
        {notes.map(n => (
          <li key={n._id}>
            <div className={`note ${n.read ? '' : 'unread'}`}>
              <div style={{ fontWeight: 600, opacity: n.read ? 0.7 : 1 }}>{n.message}</div>
              <div className="meta">
                <div>{new Date(n.createdAt).toLocaleDateString()}</div>
                <div style={{ fontWeight: 700 }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                {!n.read && (
                  <button className="btn btn--ghost" style={{ marginTop: 6 }} onClick={() => markRead(n._id)}>Mark read</button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

