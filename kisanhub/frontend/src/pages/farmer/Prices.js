import React, { useEffect, useState } from 'react';
import { pricesAPI } from '../../api';

export default function PricesPage() {
  const [prices, setPrices]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pricesAPI.getAll().then(r => setPrices(r.data.prices || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrap">
      <div style={{ background:'linear-gradient(135deg,#bf360c,#e64a19)', borderRadius:'var(--r)', padding:'1.3rem 1.6rem', color:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2rem' }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.2rem', fontWeight:900, marginBottom:'.2rem' }}>Live Mandi Prices</div>
          <div style={{ fontSize:'.82rem', opacity:.65 }}>Updated today · {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.4rem', background:'rgba(255,255,255,.15)', borderRadius:'8px', padding:'.45rem .9rem', fontSize:'.82rem', fontWeight:700 }}>
          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#69f0ae', display:'inline-block' }}/>
          Market Open
        </div>
      </div>
      {loading ? <div className="loading-center"><div className="spinner"/></div> : (<>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))', gap:'.9rem', marginBottom:'1.2rem' }}>
          {prices.map(p => {
            const up = p.change >= 0;
            return (
              <div key={p._id} style={{ background:'#fff', borderRadius:'var(--r)', padding:'1.1rem', border:'1px solid var(--border-soft)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.7rem' }}>
                  <span style={{ fontSize:'1.5rem' }}>{p.emoji}</span>
                  <span style={{ fontWeight:700 }}>{p.crop}</span>
                </div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.4rem', fontWeight:900, color:'var(--forest)', lineHeight:1 }}>Rs.{p.price.toLocaleString('en-IN')}</div>
                <div style={{ fontSize:'.72rem', color:'var(--ink-soft)' }}>{p.unit}</div>
                <div style={{ fontSize:'.78rem', fontWeight:700, marginTop:'.3rem', color: up ? '#2e7d32' : 'var(--red)' }}>{up ? 'Up' : 'Dn'} Rs.{Math.abs(p.change)}</div>
                <div style={{ fontSize:'.72rem', color:'var(--ink-soft)', marginTop:'.3rem' }}>📍 {p.market}</div>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Price Summary</div></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Crop</th><th>Price</th><th>Change</th><th>Market</th></tr></thead>
              <tbody>{prices.map(p => (
                <tr key={p._id}>
                  <td>{p.emoji} <strong>{p.crop}</strong></td>
                  <td><strong>Rs.{p.price.toLocaleString('en-IN')}</strong> <span style={{ fontSize:'.75rem', color:'var(--ink-soft)' }}>{p.unit}</span></td>
                  <td style={{ color: p.change >= 0 ? '#2e7d32' : 'var(--red)', fontWeight:700 }}>{p.change >= 0 ? '+' : ''}{p.change}</td>
                  <td>{p.market}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </>)}
    </div>
  );
}
