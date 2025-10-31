import React from 'react';

export default function ApplicationList({ applications = [], onAction }) {
  if (!applications.length) return <div className="card"><p>No applications</p></div>;

  return (
    <div className="card">
      <h4>Applications</h4>
      <ul>
        {applications.map(app => (
          <li key={app._id} style={{marginBottom:8}}>
            {app.student?.name} — {app.student?.email} — <strong>{app.status}</strong>
            <div style={{marginTop:6}}>
              <button className="btn" onClick={()=>onAction(app._id,'accepted')}>Accept</button>
              <button style={{marginLeft:8}} onClick={()=>onAction(app._id,'rejected')}>Reject</button>
              <button style={{marginLeft:8}} onClick={()=>onAction(app._id,'shortlisted')}>Shortlist</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
