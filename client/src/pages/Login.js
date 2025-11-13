import React, { useState } from 'react';
import { login, register } from '../api';
import { saveAuth } from '../auth';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' });
  const [loading, setLoading] = useState(false);

  function update(k,v){ setForm(p=>({...p,[k]:v})); }

  async function submit(e){
    e.preventDefault(); setLoading(true);
    try {
      if (mode==='login') {
        const res = await login(form.email, form.password);
        if (res.token) { saveAuth(res.token, res.user); onLogin(res.user, res.token); }
        else alert(res.message || 'Login failed');
      } else {
        const res = await register(form);
        if (res.token) { saveAuth(res.token, res.user); onLogin(res.user, res.token); }
        else alert(res.message || 'Register failed');
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="card hoverable" style={{maxWidth:520, margin:'56px auto'}}>
      <div className="row" style={{justifyContent:'space-between'}}>
        <h2 style={{marginBottom:0}}>{mode==='login'?'Welcome back':'Create account'}</h2>
        <span className="badge">VMS</span>
      </div>
      <div className="row" style={{margin:'10px 0 14px'}}>
        <button type="button" className={`btn ${mode==='login'?'':'btn--ghost'}`} onClick={()=>setMode('login')}>Login</button>
        <button type="button" className={`btn ${mode==='register'?'':'btn--ghost'}`} onClick={()=>setMode('register')}>Register</button>
      </div>
      <form onSubmit={submit}>
        {mode==='register' && <input placeholder="Full name" value={form.name} onChange={e=>update('name', e.target.value)} required />}
        <input placeholder="Email" value={form.email} onChange={e=>update('email', e.target.value)} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>update('password', e.target.value)} required />
        {mode==='register' && (
          <div className="row" style={{gap:8}}>
            <button type="button" className={`btn ${form.role==='student'?'':'btn--ghost'}`} onClick={()=>update('role','student')}>Student</button>
            <button type="button" className={`btn ${form.role==='teacher'?'':'btn--ghost'}`} onClick={()=>update('role','teacher')}>Teacher</button>
          </div>
        )}
        <div className="row" style={{gap:10, marginTop:12}}>
          <button className="btn" type="submit" disabled={loading}>{mode==='login'?'Login':'Create account'}</button>
          <button type="button" className="btn btn--ghost" onClick={()=>setMode(m=>m==='login'?'register':'login')}>{mode==='login'?'Need an account?':'Have an account?'}</button>
        </div>
      </form>
    </div>
  );
}
