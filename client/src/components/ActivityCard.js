import React, { useEffect, useState } from 'react';

export default function ActivityCard({ activity, onApply }) {
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const iv = setInterval(()=>setNow(new Date()), 1000); return ()=>clearInterval(iv); }, []);

  const dl = new Date(activity.deadline);
  const expired = !activity.isActive || dl <= now;
  const remaining = Math.max(0, dl - now);

  function nice(ms) {
    if (ms <= 0) return 'Deadline passed';
    const s = Math.floor(ms/1000);
    const d = Math.floor(s/86400); const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60); const sec = s%60;
    if (d>0) return `${d}d ${h}h ${m}m`;
    if (h>0) return `${h}h ${m}m`;
    return `${m}m ${sec}s`;
  }

  return (
    <div className="card">
      <h4>{activity.title}</h4>
      <p>{activity.description}</p>
      <p><strong>Venue:</strong> {activity.venue || '—'}</p>
      <p><strong>Deadline:</strong> {dl.toLocaleString()} <em>({nice(remaining)})</em></p>
      <p><strong>Organizer:</strong> {activity.organizer?.name || 'Unknown'}</p>
      <div>
        <button className="btn" onClick={onApply} disabled={expired}>{expired ? 'Deadline passed' : 'Apply'}</button>
      </div>
    </div>
  );
}
