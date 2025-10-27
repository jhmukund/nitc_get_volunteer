import React, { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import { getUser, getToken, logout } from './auth';

export default function App() {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  const onLogin = (u, t) => { setUser(u); setToken(t); };

  const handleLogout = () => { logout(); setUser(null); setToken(null); window.location.reload(); };

  if (!user) return <Login onLogin={onLogin} />;

  return (
    <div className="container">
      <header className="header">
        <h1>Volunteer Management</h1>
        <div className="header-right">
          <span>Welcome, {user.name} ({user.role})</span>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main>
        {user.role === 'student' ? <StudentDashboard token={token} /> : <TeacherDashboard token={token} />}
      </main>
    </div>
  );
}