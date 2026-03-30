import React, { useEffect, useState } from 'react';
import { schemesAPI } from '../../api';
import toast from 'react-hot-toast';

const EMPTY = { title:'', ministry:'', emoji:'🏛️', category:'subsidy', description:'', benefits:'', eligibility:'', tags:'', deadline:'', applyUrl:'' };

export default function AdminSchemes() {
  const [schemes, setSchemes]   = useState([]);
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [tab, setTab]           = useState('schemes');

  const load = () => {
    setLoading(true);
    Promise.all([schemesAPI.getAll(), schemesAPI.getApps()])
      .then(([sr, ar]) => { setSchemes(sr.data.schemes || []); setApps(ar.data.applications || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (s) => { setForm({ ...s, tags: s.tags?.join(', ') || '' }); setEditing(s._id); setModal(true); };
  const handle   = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editing) { await schemesAPI.update(editing, data); toast.success('Scheme updated!'); }
      else { await schemesAPI.create(data); toast.success('Scheme added!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this scheme?')) return;
    try { await schemesAPI.remove(id); toast.success('Removed!'); load(); }
    catch { toast.error('Remove failed.'); }
  };

  const reviewApp = async (id, status) => {
    try { await schemesAPI.updateApp(id, { status }); toast.success('Application ' + status + '!'); load(); }
    catch { toast.error('Update failed.'); }
  };

  const STATUS_BADGE = { pending:'badge-amber', under_review:'badge-sky', approved:'badge-green', rejected:'badge-red' };

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">Scheme Management</div>
        <div style={{ display:'flex', gap:'.5rem', alignItems:'center' }}>
          <div style={{ display:'flex', background:'var(--parchment)', borderRadius:'8px', padding:'3px', border:'1px solid var(--border)' }}>
            {[['schemes','Schemes'],['apps','Applications']].map(([v,l]) => (
              <button key={v} onClick={() => setTab(v)} style={{ padding:'.4rem .9rem', borderRadius:'6px', border:'none', background: tab===v ? '#fff' : 'transparent', color: tab===v ? 'var(--forest)' : 'var(--ink-soft)', fontWeight:600, fontSize:'.83rem', cursor:'pointer' }}>{l} {v==='apps' && apps.filter(a=>a.status==='pending').length > 0 && <span style={{ background:'var(--red)', color:'#fff', borderRadius:'10px', padding:'1px 6px', fontSize:'.68rem', marginLeft:'4px' }}>{apps.filter(a=>a.status==='pending').length}</span>}</button>
            ))}
          </div>
          {tab === 'schemes' && <button className="btn btn-success" onClick={openAdd}>+ Add Scheme</button>}
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner"/></div> : tab === 'schemes' ? (
        <div className="card">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Scheme</th><th>Ministry</th><th>Category</th><th>Deadline</th><th>Actions</th></tr></thead>
              <tbody>
                {schemes.map(s => (
                  <tr key={s._id}>
                    <td><span style={{ marginRight:'.5rem' }}>{s.emoji}</span><strong>{s.title}</strong></td>
                    <td style={{ color:'var(--ink-soft)', fontSize:'.82rem' }}>{s.ministry}</td>
                    <td style={{ textTransform:'capitalize' }}>{s.category?.replace('_',' ')}</td>
                    <td style={{ fontSize:'.82rem' }}>{s.deadline}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ fontSize:'.75rem', marginRight:'.3rem' }} onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ fontSize:'.75rem' }} onClick={() => remove(s._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {schemes.length === 0 && <tr><td colSpan="5" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No schemes yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>App ID</th><th>Farmer</th><th>Scheme</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontSize:'.8rem', color:'var(--ink-soft)' }}>{a._id.slice(-6).toUpperCase()}</td>
                    <td><strong>{a.farmer?.firstName} {a.farmer?.lastName}</strong><div style={{ fontSize:'.77rem', color:'var(--ink-soft)' }}>{a.farmer?.district}, {a.farmer?.state}</div></td>
                    <td style={{ fontSize:'.85rem' }}>{a.scheme?.title}</td>
                    <td style={{ fontSize:'.82rem', color:'var(--ink-soft)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><span className={'badge ' + (STATUS_BADGE[a.status]||'badge-gray')}>{a.status?.replace('_',' ')}</span></td>
                    <td>
                      {a.status === 'pending' || a.status === 'under_review' ? (<>
                        <button className="btn btn-success btn-sm" style={{ fontSize:'.75rem', marginRight:'.3rem' }} onClick={() => reviewApp(a._id,'approved')}>Approve</button>
                        <button className="btn btn-danger btn-sm" style={{ fontSize:'.75rem' }} onClick={() => reviewApp(a._id,'rejected')}>Reject</button>
                      </>) : <span style={{ color:'var(--ink-soft)', fontSize:'.8rem' }}>Reviewed</span>}
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && <tr><td colSpan="6" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No applications yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-head"><h3>{editing ? 'Edit Scheme' : 'Add Scheme'}</h3><button className="modal-close" onClick={() => setModal(false)}>✕</button></div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label>Scheme Name</label><input name="title" value={form.title} onChange={handle} required/></div>
                  <div className="form-group"><label>Emoji</label><input name="emoji" value={form.emoji} onChange={handle} style={{ width:'80px' }}/></div>
                </div>
                <div className="form-group"><label>Ministry</label><input name="ministry" value={form.ministry} onChange={handle} required/></div>
                <div className="form-row">
                  <div className="form-group"><label>Category</label>
                    <select name="category" value={form.category} onChange={handle}>
                      {['insurance','subsidy','loan','equipment','direct_benefit','other'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Deadline</label><input name="deadline" value={form.deadline} onChange={handle} placeholder="e.g. 31 Mar 2026"/></div>
                </div>
                <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={handle} rows="3" required/></div>
                <div className="form-group"><label>Benefits</label><input name="benefits" value={form.benefits} onChange={handle} placeholder="e.g. 55% subsidy on drip irrigation"/></div>
                <div className="form-group"><label>Tags (comma separated)</label><input name="tags" value={form.tags} onChange={handle} placeholder="e.g. Insurance, All Crops, Natural Calamity"/></div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Scheme'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
