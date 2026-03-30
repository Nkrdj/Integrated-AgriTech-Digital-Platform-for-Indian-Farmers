import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = () => {
    setLoading(true);
    adminAPI.getFarmers(search ? { search } : {}).then(r => setFarmers(r.data.farmers || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const toggle = async (id, current) => {
    try {
      await adminAPI.updateFarmer(id, { isActive: !current });
      toast.success('Farmer status updated!');
      load();
    } catch { toast.error('Update failed.'); }
  };

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">Farmer Management</div>
        <div style={{ display:'flex', gap:'.5rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && load()} placeholder="Search name, phone..." style={{ padding:'.45rem .9rem', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'.88rem', outline:'none', width:'220px' }}/>
          <button className="btn btn-success btn-sm" onClick={load}>Search</button>
        </div>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <table className="tbl">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Crop</th><th>Land</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {farmers.map(f => (
                  <tr key={f._id}>
                    <td><strong>{f.firstName} {f.lastName}</strong></td>
                    <td style={{ color:'var(--ink-soft)' }}>{f.email}</td>
                    <td>{f.phone}</td>
                    <td>{f.district}, {f.state}</td>
                    <td>{f.primaryCrop}</td>
                    <td>{f.landAcres} ac</td>
                    <td><span className={'badge ' + (f.isActive ? 'badge-green' : 'badge-red')}>{f.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ fontSize:'.75rem' }} onClick={() => toggle(f._id, f.isActive)}>
                        {f.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {farmers.length === 0 && <tr><td colSpan="8" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No farmers found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
