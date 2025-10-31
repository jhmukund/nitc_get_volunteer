import React, { useState } from 'react';

export default function ActivityForm({ onCreate }) {
  const [form, setForm] = useState({ title:'', description:'', venue:'', date:'', deadline:'', requiredSkills:'', seats:'' });

  function update(k,v){ setForm(p=>({...p,[k]:v})); }

  function submit(e){
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      venue: form.venue,
      date: form.date ? new Date(form.date).toISOString() : null,
      deadline: form.deadline,
      requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map(s=>s.trim()).filter(Boolean) : [],
      seats: form.seats ? Number(form.seats) : undefined
    };
    onCreate(payload);
    setForm({ title:'', description:'', venue:'', date:'', deadline:'', requiredSkills:'', seats:'' });
  }

  return (
    <div className="card">
      <h3>Create Activity</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={e=>update('title', e.target.value)} required />
        <textarea placeholder="Description" rows={3} value={form.description} onChange={e=>update('description', e.target.value)} />
        <div className="form-row">
          <input type="datetime-local" value={form.date} onChange={e=>update('date', e.target.value)} />
          <input type="datetime-local" value={form.deadline} onChange={e=>update('deadline', e.target.value)} required />
        </div>
        <input placeholder="Venue" value={form.venue} onChange={e=>update('venue', e.target.value)} />
        <input placeholder="Required skills (comma separated)" value={form.requiredSkills} onChange={e=>update('requiredSkills', e.target.value)} />
        <input placeholder="Seats (optional)" type="number" value={form.seats} onChange={e=>update('seats', e.target.value)} />
        <button className="btn" type="submit">Create</button>
      </form>
    </div>
  );
}
