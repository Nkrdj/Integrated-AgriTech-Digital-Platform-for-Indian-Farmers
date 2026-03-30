// ── Shop.js ──────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { productsAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export function ShopPage() {
  const { addToCart, cart } = useAuth();
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll(cat !== 'all' ? { category: cat } : {})
      .then(r => setProducts(r.data.products || []))
      .finally(() => setLoading(false));
  }, [cat]);

  const cartQty = (id) => cart.find(i => i.product?._id === id)?.quantity || 0;

  return (
    <div className="page-wrap">
      <div className="page-hdr"><div className="page-hdr-title">🛒 Shop Agricultural Inputs</div></div>
      <div className="filter-bar" style={{ display:'flex', gap:'.6rem', flexWrap:'wrap', marginBottom:'1.2rem' }}>
        {[['all','All Products'],['seeds','🌱 Seeds'],['fertilizer','🧪 Fertilizers'],['pesticide','🛡️ Pesticides'],['equipment','🔧 Equipment']].map(([v,l]) => (
          <button key={v} onClick={() => setCat(v)} style={{ padding:'.38rem .9rem', borderRadius:'20px', border:`1.5px solid ${cat===v ? 'var(--forest)' : 'var(--border)'}`, background: cat===v ? 'var(--forest)' : '#fff', color: cat===v ? '#fff' : 'var(--ink-soft)', fontSize:'.81rem', fontWeight:600, cursor:'pointer' }}>{l}</button>
        ))}
      </div>
      {loading ? <div className="loading-center"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
          {products.map(p => {
            const qty = cartQty(p._id);
            const stockLabel = { in:'✅ In Stock', low:'⚠️ Low Stock', out:'❌ Out of Stock' }[p.stockLevel];
            const stockColor = { in:'#2e7d32', low:'var(--gold)', out:'var(--red)' }[p.stockLevel];
            return (
              <div key={p._id} style={{ background:'#fff', borderRadius:'var(--r)', border:`1.5px solid ${qty > 0 ? 'var(--leaf)' : 'var(--border-soft)'}`, overflow:'hidden', transition:'all .22s' }}>
                <div style={{ height:'140px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--sage),var(--parchment))', overflow:'hidden' }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ fontSize:'2.8rem' }}>{p.emoji}</div>
                  )}
                </div>
                <div style={{ padding:'.9rem' }}>
                  <div style={{ fontWeight:700, fontSize:'.9rem', marginBottom:'.2rem' }}>{p.name}</div>
                  <div style={{ fontSize:'.74rem', color:'var(--ink-soft)', marginBottom:'.55rem', textTransform:'capitalize' }}>{p.category}</div>
                  <div style={{ fontSize:'.73rem', color: stockColor, marginBottom:'.5rem' }}>{stockLabel} — {p.stock}{p.stockLevel === 'out' ? '' : ' available'}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.1rem', fontWeight:900, color:'var(--forest)' }}>₹{p.price} <span style={{ fontFamily:'DM Sans', fontSize:'.72rem', fontWeight:400, color:'var(--ink-soft)' }}>{p.unit}</span></div>
                  <button disabled={p.stockLevel === 'out'} onClick={() => addToCart(p._id)}
                    style={{ width:'100%', marginTop:'.7rem', padding:'.52rem', background: qty > 0 ? 'var(--leaf)' : 'var(--forest)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'.83rem', fontWeight:700, cursor: p.stockLevel === 'out' ? 'not-allowed' : 'pointer', opacity: p.stockLevel === 'out' ? .5 : 1 }}>
                    {p.stockLevel === 'out' ? 'Out of Stock' : qty > 0 ? `✓ In Cart (${qty})` : '+ Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShopPage;
