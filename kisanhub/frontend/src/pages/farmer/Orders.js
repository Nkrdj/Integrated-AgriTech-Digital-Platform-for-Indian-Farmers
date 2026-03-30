import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../../api';

const STEPS = ['Ordered','Processing','Shipped','Out for Delivery','Delivered'];
const STATUS_BADGE = { pending:'badge-amber', processing:'badge-sky', shipped:'badge-sky', out_for_delivery:'badge-sky', delivered:'badge-green', cancelled:'badge-red' };

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.myOrders().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrap">
      <div className="page-hdr"><div className="page-hdr-title">My Orders</div></div>
      {loading ? <div className="loading-center"><div className="spinner"/></div>
      : orders.length === 0 ? <div className="empty-state"><div className="es-icon">📦</div><p>No orders yet. Start shopping!</p></div>
      : orders.map(order => (
        <div key={order._id} style={{ background:'#fff', border:'1px solid var(--border-soft)', borderRadius:'var(--r)', marginBottom:'1rem', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.9rem 1.3rem', background:'var(--parchment)', borderBottom:'1px solid var(--border-soft)' }}>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, color:'var(--forest)' }}>{order.orderNumber}</div>
              <div style={{ fontSize:'.79rem', color:'var(--ink-soft)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
            </div>
            <span className={'badge ' + (STATUS_BADGE[order.status] || 'badge-gray')}>{order.status?.replace('_',' ')}</span>
          </div>
          <div style={{ padding:'.9rem 1.3rem' }}>
            {order.items.map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'.85rem', padding:'.4rem 0', borderBottom: i < order.items.length-1 ? '1px solid var(--border-soft)' : 'none', fontSize:'.87rem' }}>
                <span style={{ fontSize:'1.3rem' }}>{item.emoji}</span>
                <span style={{ flex:1 }}>{item.name}</span>
                <span style={{ color:'var(--ink-soft)' }}>x{item.quantity}</span>
                <strong style={{ color:'var(--forest)' }}>Rs.{item.subtotal.toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
          {order.status !== 'cancelled' && (
            <div style={{ padding:'.5rem 1.3rem 1rem', overflowX:'auto' }}>
              <div style={{ display:'flex', alignItems:'center', minWidth:'380px' }}>
                {STEPS.map((lbl, i) => {
                  const done   = i < order.statusStep;
                  const active = i === order.statusStep;
                  return (
                    <React.Fragment key={lbl}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:'72px' }}>
                        <div style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:800, border: done ? 'none' : '2px solid ' + (active ? 'var(--forest)' : 'var(--border)'), background: done ? 'var(--leaf)' : '#fff', color: done ? '#fff' : active ? 'var(--forest)' : 'var(--ink-soft)' }}>
                          {done ? '✓' : i+1}
                        </div>
                        <div style={{ fontSize:'.66rem', fontWeight:700, color: done || active ? 'var(--forest)' : 'var(--ink-soft)', marginTop:'.35rem', textAlign:'center' }}>{lbl}</div>
                      </div>
                      {i < STEPS.length-1 && <div style={{ flex:1, height:'2px', background: done ? 'var(--leaf)' : 'var(--border)', marginTop:'-18px' }}/>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.75rem 1.3rem', background:'var(--parchment)', borderTop:'1px solid var(--border-soft)', fontSize:'.85rem' }}>
            <span style={{ color:'var(--ink-soft)' }}>Subtotal + Delivery + GST =</span>
            <strong style={{ color:'var(--forest)', fontSize:'.95rem' }}>Rs.{order.total.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
