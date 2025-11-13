import React from 'react';

export default function ApplicationList({ applications = [], onAction }) {
  if (!applications.length) return <div className="card"><p>No applications</p></div>;

  return (
    <div className="card hoverable">
      <h4>Applications</h4>
      <ul>
        {applications.map(app => (
          <li key={app._id} className="note" style={{marginBottom:8}}>
            <div>
              <div style={{fontWeight:600}}>{app.student?.name} <span className="muted">• {app.student?.email}</span></div>
              <div className="muted" style={{marginTop:4}}>Status: <span className="badge" style={{textTransform:'capitalize'}}>{app.status}</span></div>
            </div>
            <div>
              <button className="btn" onClick={()=>onAction(app._id,'accepted')}>Accept</button>
              <button className="btn btn--ghost" style={{marginLeft:8}} onClick={()=>onAction(app._id,'rejected')}>Reject</button>
              <button className="btn btn--ghost" style={{marginLeft:8}} onClick={()=>onAction(app._id,'shortlisted')}>Shortlist</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

