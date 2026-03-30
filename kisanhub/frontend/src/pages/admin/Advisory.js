import React, { useEffect, useState } from 'react';
import { advisoryAPI } from '../../api';
import toast from 'react-hot-toast';

const EMPTY = { title:'', type:'pest', crop:'All Crops', content:'', severity:'medium' };
const TYPE_COLOR = { pest:'#e53935', fertilizer:'#c9921a', irrigation:'#1a6fa8', disease:'#7b1fa2', soil:'#4a9e54', general:'#2d5a34', weather:'#1565c0' };

export default function AdminAdvisory() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [form, setForm]             = useState(EMPTY);
  const [editing, setEditing]       = useState(null);
  const [saving, setSaving]         = useState(false);

  const load = () => {
    setLoading(true);
    advisoryAPI.getAll().then(r => setAdvisories(r.data.advisories || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (a) => { setForm({ title:a.title, type:a.type, crop:a.crop, content:a.content, severity:a.severity }); setEditing(a._id); setModal(true); };
  const handle   = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await advisoryAPI.update(editing, form); toast.success('Advisory updated!'); }
      else { await advisoryAPI.create(form); toast.success('Advisory published!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this advisory?')) return;
    try { await advisoryAPI.remove(id); toast.success('Removed!'); load(); }
    catch { toast.error('Remove failed.'); }
  };

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">Advisory Management</div>
        <button className="btn btn-success" onClick={openAdd}>+ Publish Advisory</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <table className="tbl">
              <thead><tr><th>Title</th><th>Type</th><th>Crop</th><th>Severity</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {advisories.map(a => (
                  <tr key={a._id}>
                    <td><strong>{a.title}</strong></td>
                    <td><span style={{ color: TYPE_COLOR[a.type]||'var(--forest)', fontWeight:700, fontSize:'.8rem', textTransform:'uppercase' }}>{a.type}</span></td>
                    <td>{a.crop}</td>
                    <td><span className={'badge ' + (a.severity==='high'?'badge-red':a.severity==='medium'?'badge-amber':'badge-green')}>{a.severity}</span></td>
                    <td style={{ color:'var(--ink-soft)', fontSize:'.82rem' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ fontSize:'.75rem', marginRight:'.3rem' }} onClick={() => openEdit(a)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ fontSize:'.75rem' }} onClick={() => remove(a._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {advisories.length === 0 && <tr><td colSpan="6" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No advisories yet</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-head"><h3>{editing ? 'Edit Advisory' : 'New Advisory'}</h3><button className="modal-close" onClick={() => setModal(false)}>✕</button></div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group"><label>Title</label><input name="title" value={form.title} onChange={handle} required/></div>
                <div className="form-row">
                  <div className="form-group"><label>Type</label>
                    <select name="type" value={form.type} onChange={handle}>
                      {['pest','fertilizer','irrigation','disease','soil','weather','general'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Severity</label>
                    <select name="severity" value={form.severity} onChange={handle}>
                      {['low','medium','high'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Target Crop</label>
                  <select name="crop" value={form.crop} onChange={handle}>
                    {['All Crops','Rice','Maize','Cotton','Sugarcane','Vegetables','Groundnut'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Advisory Content</label><textarea name="content" value={form.content} onChange={handle} rows="5" required/></div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
