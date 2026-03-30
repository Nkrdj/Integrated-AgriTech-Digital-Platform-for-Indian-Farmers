import React, { useEffect, useState } from 'react';
import { advisoryAPI } from '../../api';

const TYPE_COLOR = { pest:'#e53935', fertilizer:'#c9921a', irrigation:'#1a6fa8', disease:'#7b1fa2', soil:'#4a9e54', general:'#2d5a34', weather:'#1565c0' };

export default function AdvisoryPage() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [crop, setCrop]             = useState('all');

  useEffect(() => {
    setLoading(true);
    advisoryAPI.getAll(crop !== 'all' ? { crop } : {})
      .then(r => setAdvisories(r.data.advisories || []))
      .finally(() => setLoading(false));
  }, [crop]);

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">🌱 Crop Advisory & Alerts</div>
        <select value={crop} onChange={e => setCrop(e.target.value)} style={{ padding:'.4rem .8rem', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'.85rem', outline:'none', background:'#fff' }}>
          {['all','Rice','Maize','Cotton','Vegetables','Groundnut'].map(c => <option key={c} value={c}>{c === 'all' ? 'All Crops' : c}</option>)}
        </select>
      </div>
      {loading ? <div className="loading-center"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:'1rem' }}>
          {advisories.map(a => (
            <div key={a._id} style={{ background:'#fff', borderRadius:'var(--r)', border:'1px solid var(--border-soft)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
              <div style={{ height:'5px', background: TYPE_COLOR[a.type] || 'var(--leaf)' }}/>
              <div style={{ padding:'1.1rem' }}>
                <div style={{ fontSize:'.7rem', fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', color: TYPE_COLOR[a.type], marginBottom:'.35rem' }}>{a.type}</div>
                <div style={{ fontWeight:800, fontSize:'.95rem', color:'var(--forest)', marginBottom:'.3rem' }}>{a.title}</div>
                <div style={{ marginBottom:'.65rem' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', background:'var(--sage)', color:'var(--forest)', fontSize:'.74rem', fontWeight:700, padding:'.2rem .6rem', borderRadius:'8px' }}>🌾 {a.crop}</span>
                  {a.severity === 'high' && <span className="badge badge-red" style={{ marginLeft:'.4rem' }}>High Priority</span>}
                </div>
                <div style={{ fontSize:'.84rem', color:'var(--ink-mid)', lineHeight:1.65 }}>{a.content}</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'.85rem', paddingTop:'.75rem', borderTop:'1px solid var(--border-soft)', fontSize:'.74rem', color:'var(--ink-soft)' }}>
                  <span>📅 {new Date(a.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                </div>
              </div>
            </div>
          ))}
          {advisories.length === 0 && <div className="empty-state"><div className="es-icon">🌱</div><p>No advisories found</p></div>}
        </div>
      )}
    </div>
  );
}
