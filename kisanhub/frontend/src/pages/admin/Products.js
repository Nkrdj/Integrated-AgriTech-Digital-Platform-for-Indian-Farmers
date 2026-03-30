import React, { useEffect, useState } from 'react';
import { productsAPI } from '../../api';
import toast from 'react-hot-toast';

const EMPTY = { name:'', category:'seeds', emoji:'🌱', price:'', unit:'per kg', stock:'', description:'', brand:'' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    productsAPI.getAll().then(r => setProducts(r.data.products || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (p) => { setForm({ name:p.name, category:p.category, emoji:p.emoji, price:p.price, unit:p.unit, stock:p.stock, description:p.description||'', brand:p.brand||'' }); setEditing(p._id); setModal(true); };

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editing) { await productsAPI.update(editing, data); toast.success('Product updated!'); }
      else { await productsAPI.create(data); toast.success('Product created!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try { await productsAPI.remove(id); toast.success('Removed!'); load(); }
    catch { toast.error('Remove failed.'); }
  };

  const STOCK_BADGE = { in:'badge-green', low:'badge-amber', out:'badge-red' };

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">Product Management</div>
        <button className="btn btn-success" onClick={openAdd}>+ Add Product</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <table className="tbl">
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><span style={{ marginRight:'.5rem' }}>{p.emoji}</span><strong>{p.name}</strong>{p.brand && <span style={{ color:'var(--ink-soft)', fontSize:'.77rem', marginLeft:'.4rem' }}>{p.brand}</span>}</td>
                    <td style={{ textTransform:'capitalize' }}>{p.category}</td>
                    <td><strong>Rs.{p.price.toLocaleString('en-IN')}</strong> <span style={{ color:'var(--ink-soft)', fontSize:'.77rem' }}>{p.unit}</span></td>
                    <td>{p.stock}</td>
                    <td><span className={'badge ' + (STOCK_BADGE[p.stockLevel]||'badge-gray')}>{p.stockLevel === 'in' ? 'In Stock' : p.stockLevel === 'low' ? 'Low Stock' : 'Out of Stock'}</span></td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ fontSize:'.75rem', marginRight:'.3rem' }} onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ fontSize:'.75rem' }} onClick={() => remove(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="6" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No products found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-head"><h3>{editing ? 'Edit Product' : 'Add Product'}</h3><button className="modal-close" onClick={() => setModal(false)}>✕</button></div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label>Product Name</label><input name="name" value={form.name} onChange={handle} required/></div>
                  <div className="form-group"><label>Emoji</label><input name="emoji" value={form.emoji} onChange={handle} style={{ width:'80px' }}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Category</label>
                    <select name="category" value={form.category} onChange={handle}>
                      {['seeds','fertilizer','pesticide','equipment'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Brand</label><input name="brand" value={form.brand} onChange={handle} placeholder="Optional"/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Price (Rs.)</label><input name="price" type="number" step="0.01" value={form.price} onChange={handle} required/></div>
                  <div className="form-group"><label>Unit</label><input name="unit" value={form.unit} onChange={handle} placeholder="per kg, per bag..."/></div>
                </div>
                <div className="form-group"><label>Stock Quantity</label><input name="stock" type="number" value={form.stock} onChange={handle} required/></div>
                <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={handle} rows="2"/></div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
