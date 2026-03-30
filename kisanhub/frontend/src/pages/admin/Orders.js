import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../../api';
import toast from 'react-hot-toast';

const STATUS_BADGE = { pending:'badge-amber', processing:'badge-sky', shipped:'badge-sky', out_for_delivery:'badge-sky', delivered:'badge-green', cancelled:'badge-red' };
const NEXT_STATUS = { pending:'processing', processing:'shipped', shipped:'out_for_delivery', out_for_delivery:'delivered' };

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('');

  const load = () => {
    setLoading(true);
    ordersAPI.getAll(filter ? { status:filter } : {}).then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  const advance = async (id, status) => {
    const next = NEXT_STATUS[status];
    if (!next) return;
    try { await ordersAPI.updateStatus(id, next); toast.success('Status updated!'); load(); }
    catch { toast.error('Update failed.'); }
  };

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">Order Management</div>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding:'.4rem .8rem', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'.85rem', outline:'none' }}>
          <option value="">All Orders</option>
          {['pending','processing','shipped','out_for_delivery','delivered','cancelled'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <table className="tbl">
              <thead><tr><th>Order</th><th>Farmer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{o.farmer?.firstName} {o.farmer?.lastName}<div style={{ fontSize:'.75rem', color:'var(--ink-soft)' }}>{o.farmer?.district}</div></td>
                    <td style={{ fontSize:'.82rem' }}>{o.items?.map(i => i.name).join(', ').slice(0,40)}{o.items?.join('')?.length > 40 ? '...' : ''}</td>
                    <td><strong>Rs.{o.total?.toLocaleString('en-IN')}</strong></td>
                    <td style={{ color:'var(--ink-soft)', fontSize:'.82rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><span className={'badge ' + (STATUS_BADGE[o.status]||'badge-gray')}>{o.status?.replace('_',' ')}</span></td>
                    <td>
                      {NEXT_STATUS[o.status] && (
                        <button className="btn btn-success btn-sm" style={{ fontSize:'.75rem' }} onClick={() => advance(o._id, o.status)}>
                          → {NEXT_STATUS[o.status]?.replace('_',' ')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan="7" style={{ textAlign:'center', padding:'2rem', color:'var(--ink-soft)' }}>No orders found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
