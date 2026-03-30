import React, { useEffect, useState } from 'react';
import { adminAPI, ordersAPI } from '../../api';

const STATUS_BADGE = { pending:'badge-amber', processing:'badge-sky', shipped:'badge-sky', out_for_delivery:'badge-sky', delivered:'badge-green', cancelled:'badge-red' };

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data.stats));
    ordersAPI.getAll({ limit:5 }).then(r => setOrders(r.data.orders || []));
  }, []);

  return (
    <div className="page-wrap">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon kpi-icon-g">🌾</div><div><div className="kpi-num">{stats?.totalFarmers ?? '—'}</div><div className="kpi-lbl">Registered Farmers</div></div></div>
        <div className="kpi-card"><div className="kpi-icon kpi-icon-a">💰</div><div><div className="kpi-num">Rs.{stats?.totalRevenue ? Math.round(stats.totalRevenue/1000)+'K' : '—'}</div><div className="kpi-lbl">Total Revenue</div></div></div>
        <div className="kpi-card"><div className="kpi-icon kpi-icon-b">📦</div><div><div className="kpi-num">{stats?.activeOrders ?? '—'}</div><div className="kpi-lbl">Active Orders</div></div></div>
        <div className="kpi-card"><div className="kpi-icon kpi-icon-r">🛒</div><div><div className="kpi-num">{stats?.totalProducts ?? '—'}</div><div className="kpi-lbl">Total Products</div></div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><div className="card-title">Monthly Orders</div></div>
          <div className="card-body">
            {stats?.monthlyOrders?.length ? (
              <div style={{ display:'flex', alignItems:'flex-end', gap:'.6rem', height:'120px' }}>
                {stats.monthlyOrders.map((m,i) => {
                  const max = Math.max(...stats.monthlyOrders.map(x=>x.count),1);
                  const months=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  return (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'.35rem' }}>
                      <div style={{ fontSize:'.7rem', fontWeight:700, color:'var(--forest)' }}>{m.count}</div>
                      <div style={{ width:'100%', height:(m.count/max*90)+'px', background:'var(--leaf)', borderRadius:'5px 5px 0 0', minHeight:'4px' }}/>
                      <div style={{ fontSize:'.68rem', color:'var(--ink-soft)', fontWeight:600 }}>{months[m._id]}</div>
                    </div>
                  );
                })}
              </div>
            ) : <div style={{ color:'var(--ink-soft)', textAlign:'center', padding:'2rem', fontSize:'.85rem' }}>No data yet</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Recent Orders</div></div>
          <div>
            {orders.map(o => (
              <div key={o._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.7rem 1.2rem', borderBottom:'1px solid var(--border-soft)', fontSize:'.85rem' }}>
                <div><div style={{ fontWeight:700 }}>{o.orderNumber}</div><div style={{ color:'var(--ink-soft)', fontSize:'.78rem' }}>{o.farmer?.firstName} {o.farmer?.lastName}</div></div>
                <div style={{ textAlign:'right' }}><strong style={{ color:'var(--forest)' }}>Rs.{o.total?.toLocaleString('en-IN')}</strong><div><span className={'badge ' + (STATUS_BADGE[o.status]||'badge-gray')} style={{ marginTop:'3px' }}>{o.status}</span></div></div>
              </div>
            ))}
            {orders.length === 0 && <div style={{ padding:'1.5rem', color:'var(--ink-soft)', textAlign:'center', fontSize:'.85rem' }}>No orders yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
