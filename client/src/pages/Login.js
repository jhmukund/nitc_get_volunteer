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
    <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
      <h2>{mode==='login'?'Login':'Register'}</h2>
      <form onSubmit={submit}>
        {mode==='register' && <input placeholder="Full name" value={form.name} onChange={e=>update('name', e.target.value)} required />}
        <input placeholder="Email" value={form.email} onChange={e=>update('email', e.target.value)} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>update('password', e.target.value)} required />
        {mode==='register' && (
          <select value={form.role} onChange={e=>update('role', e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        )}
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button className="btn" type="submit" disabled={loading}>{mode==='login'?'Login':'Register'}</button>
          <button type="button" onClick={()=>setMode(m=>m==='login'?'register':'login')}>{mode==='login'?'Create account':'Have account?'}</button>
        </div>
      </form>
    </div>
  );
}
