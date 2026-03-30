import React, { useEffect, useState } from 'react';
import { schemesAPI } from '../../api';
import toast from 'react-hot-toast';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    schemesAPI.getAll().then(r => setSchemes(r.data.schemes || [])).finally(() => setLoading(false));
  }, []);

  const apply = async (id, title) => {
    setApplying(id);
    try {
      await schemesAPI.apply(id);
      toast.success('Application submitted for ' + title);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed.');
    } finally { setApplying(null); }
  };

  return (
    <div className="page-wrap">
      <div className="page-hdr"><div className="page-hdr-title">Government Agricultural Schemes</div></div>
      {loading ? <div className="loading-center"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
          {schemes.map(s => (
            <div key={s._id} style={{ background:'#fff', borderRadius:'var(--r)', padding:'1.3rem', border:'1px solid var(--border-soft)', boxShadow:'var(--shadow)' }}>
              <div style={{ display:'flex', gap:'.8rem', alignItems:'flex-start', marginBottom:'.8rem' }}>
                <span style={{ fontSize:'1.9rem', flexShrink:0 }}>{s.emoji}</span>
                <div>
                  <div style={{ fontWeight:800, color:'var(--forest)' }}>{s.title}</div>
                  <div style={{ fontSize:'.74rem', color:'var(--ink-soft)' }}>{s.ministry}</div>
                </div>
              </div>
              <p style={{ fontSize:'.84rem', color:'var(--ink-mid)', lineHeight:1.65, marginBottom:'.85rem' }}>{s.description}</p>
              {s.benefits && <div style={{ background:'var(--sage)', borderRadius:'7px', padding:'.5rem .75rem', fontSize:'.8rem', color:'var(--forest)', marginBottom:'.8rem' }}>Benefit: {s.benefits}</div>}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.8rem' }}>
                {s.tags?.map(t => <span key={t} style={{ background:'var(--sage)', color:'var(--forest)', fontSize:'.71rem', fontWeight:700, padding:'.2rem .6rem', borderRadius:'8px' }}>{t}</span>)}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:'.76rem', color:'var(--gold)', fontWeight:700 }}>{s.deadline}</span>
                <button className="btn btn-success btn-sm" disabled={applying === s._id} onClick={() => apply(s._id, s.title)}>
                  {applying === s._id ? 'Submitting...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
          {schemes.length === 0 && <div className="empty-state"><div className="es-icon">🏛️</div><p>No schemes available</p></div>}
        </div>
      )}
    </div>
  );
}
