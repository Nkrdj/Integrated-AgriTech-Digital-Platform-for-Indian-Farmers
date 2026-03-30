import React, { useEffect, useState } from 'react';
import { pricesAPI } from '../../api';
import toast from 'react-hot-toast';

const EMPTY = { crop:'', emoji:'🌾', price:'', unit:'per quintal', market:'', state:'Tamil Nadu', prevPrice:'', change:'' };

export default function AdminPrices() {
  const [prices, setPrices]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    pricesAPI.getAll().then(r => setPrices(r.data.prices || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (p) => { setForm({ crop:p.crop, emoji:p.emoji, price:p.price, unit:p.unit, market:p.market, state:p.state, prevPrice:p.prevPrice||'', change:p.change||'' }); setEditing(p._id); setModal(true); };
  const handle   = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price), prevPrice: parseFloat(form.prevPrice)||0, change: parseFloat(form.change)||0 };
      if (editing) { await pricesAPI.update(editing, data); toast.success('Price updated!'); }
      else { await pricesAPI.create(data); toast.success('Price added!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this price entry?')) return;
    try { await pricesAPI.remove(id); toast.success('Removed!'); load(); }
    catch { toast.error('Remove failed.'); }
  };

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">Mandi Prices Management</div>
        <button className="btn btn-success" onClick={openAdd}>+ Add Price</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <table className="tbl">
              <thead><tr><th>Crop</th><th>Price</th><th>Change</th><th>Market</th><th>State</th><th>Updated</th><th>Actions</th></tr></thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p._id}>
                    <td><span style={{ marginRight:'.5rem' }}>{p.emoji}</span><strong>{p.crop}</strong></td>
                    <td><strong>Rs.{p.price.toLocaleString('en-IN')}</strong> <span style={{ color:'var(--ink-soft)', fontSize:'.77rem' }}>{p.unit}</span></td>
                    <td style={{ color: p.change >= 0 ? '#2e7d32' : 'var(--red)', fontWeight:700 }}>{p.change >= 0 ? '+' : ''}{p.change}</td>
                    <td>{p.market}</td>
                    <td>{p.state}</td>
                    <td style={{ color:'var(--ink-soft)', fontSize:'.82rem' }}>{new Date(p.updatedAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ fontSize:'.75rem', marginRight:'.3rem' }} onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ fontSize:'.75rem' }} onClick={() => remove(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {prices.length === 0 && <tr><td colSpan="7" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No prices yet</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-head"><h3>{editing ? 'Edit Price' : 'Add Mandi Price'}</h3><button className="modal-close" onClick={() => setModal(false)}>✕</button></div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label>Crop Name</label><input name="crop" value={form.crop} onChange={handle} required/></div>
                  <div className="form-group"><label>Emoji</label><input name="emoji" value={form.emoji} onChange={handle} style={{ width:'80px' }}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Current Price (Rs.)</label><input name="price" type="number" step="0.01" value={form.price} onChange={handle} required/></div>
                  <div className="form-group"><label>Previous Price</label><input name="prevPrice" type="number" step="0.01" value={form.prevPrice} onChange={handle}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Change Amount</label><input name="change" type="number" value={form.change} onChange={handle} placeholder="Positive = up, negative = down"/></div>
                  <div className="form-group"><label>Unit</label><input name="unit" value={form.unit} onChange={handle}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Market / APMC</label><input name="market" value={form.market} onChange={handle} required/></div>
                  <div className="form-group"><label>State</label><input name="state" value={form.state} onChange={handle}/></div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Price'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
