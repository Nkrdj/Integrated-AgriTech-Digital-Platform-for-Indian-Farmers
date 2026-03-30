import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { advisoryAPI, pricesAPI, weatherAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [advisory, setAdvisory] = useState([]);
  const [prices,   setPrices]   = useState([]);
  const [weather,  setWeather]  = useState(null);

  useEffect(() => {
    advisoryAPI.getAll().then(r => setAdvisory(r.data.advisories?.slice(0,3) || []));
    pricesAPI.getAll().then(r => setPrices(r.data.prices?.slice(0,5) || []));
    weatherAPI.get(user?.district || 'Coimbatore').then(r => setWeather(r.data.weather));
  }, [user]);

  const TYPE_COLOR = { pest:'#e53935', fertilizer:'#c9921a', irrigation:'#1a6fa8', disease:'#7b1fa2', soil:'#4a9e54', general:'#2d5a34', weather:'#1565c0' };

  return (
    <div className="page-wrap">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon kpi-icon-g">🌾</div><div><div className="kpi-num">{user?.landAcres || 0}</div><div className="kpi-lbl">Acres Cultivated</div><div className="kpi-chg up">↑ Active Season</div></div></div>
        <div className="kpi-card"><div className="kpi-icon kpi-icon-a">🌱</div><div><div className="kpi-num">{user?.primaryCrop || '—'}</div><div className="kpi-lbl">Primary Crop</div></div></div>
        <div className="kpi-card"><div className="kpi-icon kpi-icon-b">📋</div><div><div className="kpi-num">{advisory.length}</div><div className="kpi-lbl">Active Advisories</div><div className="kpi-chg">Updated today</div></div></div>
        <div className="kpi-card"><div className="kpi-icon kpi-icon-r">📍</div><div><div className="kpi-num">{user?.district || '—'}</div><div className="kpi-lbl">Your District</div><div style={{ fontSize:'.76rem', color:'var(--ink-soft)', marginTop:'3px' }}>{user?.state}</div></div></div>
      </div>

      {/* Weather banner */}
      {weather && (
        <div style={{ background:'linear-gradient(135deg,#0d47a1,#1976d2)', borderRadius:'var(--r)', padding:'1.3rem 1.6rem', color:'#fff', display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.2rem' }}>
          <div style={{ fontSize:'3.2rem' }}>⛅</div>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:'2.2rem', fontWeight:900, lineHeight:1 }}>{weather.temp}°C</div>
            <div style={{ opacity:.75, fontSize:'.88rem', marginTop:'.2rem', textTransform:'capitalize' }}>{weather.description}</div>
            <div style={{ opacity:.5, fontSize:'.78rem', marginTop:'.15rem' }}>📍 {weather.city}</div>
          </div>
          <div style={{ display:'flex', gap:'.7rem', marginLeft:'auto' }}>
            {[['💧',`${weather.humidity}%`,'Humidity'],['💨',`${weather.wind_speed}km/h`,'Wind'],['🌧️',`${weather.rain_chance}%`,'Rain']].map(([i,v,l]) => (
              <div key={l} style={{ background:'rgba(255,255,255,.12)', borderRadius:'9px', padding:'.6rem .9rem', textAlign:'center' }}>
                <div style={{ fontSize:'.9rem' }}>{i}</div>
                <div style={{ fontWeight:800 }}>{v}</div>
                <div style={{ fontSize:'.68rem', opacity:.6 }}>{l}</div>
              </div>
            ))}
          </div>
          <button onClick={() => nav('/dashboard/weather')} style={{ marginLeft:'auto', background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', color:'#fff', padding:'.5rem 1rem', borderRadius:'8px', fontSize:'.82rem', cursor:'pointer' }}>7-day forecast →</button>
        </div>
      )}

      <div className="grid-2">
        {/* Prices */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">📊 Today's Mandi Prices</div>
            <button className="btn btn-outline btn-sm" onClick={() => nav('/dashboard/prices')}>View All</button>
          </div>
          <div className="card-body" style={{ padding:'0' }}>
            {prices.map(p => {
              const up = p.change >= 0;
              return (
                <div key={p._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.65rem 1.2rem', borderBottom:'1px solid var(--border-soft)', fontSize:'.88rem' }}>
                  <span>{p.emoji} {p.crop}</span>
                  <span>
                    <strong style={{ color:'var(--forest)' }}>₹{p.price.toLocaleString('en-IN')}/q</strong>
                    <span style={{ fontSize:'.74rem', fontWeight:700, color: up ? '#2e7d32' : 'var(--red)', marginLeft:'.4rem' }}>{up ? '↑' : '↓'}{Math.abs(p.change)}</span>
                  </span>
                </div>
              );
            })}
            {prices.length === 0 && <div style={{ padding:'1rem', color:'var(--ink-soft)', fontSize:'.85rem', textAlign:'center' }}>No prices available</div>}
          </div>
        </div>

        {/* Advisory */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">🌱 Latest Advisories</div>
            <button className="btn btn-outline btn-sm" onClick={() => nav('/dashboard/advisory')}>View All</button>
          </div>
          <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
            {advisory.map(a => (
              <div key={a._id} style={{ borderRadius:'9px', padding:'.85rem', border:'1px solid var(--border-soft)', borderLeft:`4px solid ${TYPE_COLOR[a.type] || 'var(--leaf)'}` }}>
                <div style={{ fontSize:'.7rem', fontWeight:800, letterSpacing:'.06em', textTransform:'uppercase', color: TYPE_COLOR[a.type], marginBottom:'.3rem' }}>{a.type}</div>
                <div style={{ fontWeight:700, color:'var(--forest)', fontSize:'.9rem', marginBottom:'.25rem' }}>{a.title}</div>
                <div style={{ fontSize:'.81rem', color:'var(--ink-soft)', lineHeight:1.55 }}>{a.content.slice(0,100)}…</div>
              </div>
            ))}
            {advisory.length === 0 && <div style={{ color:'var(--ink-soft)', fontSize:'.85rem', textAlign:'center', padding:'1rem' }}>No advisories yet</div>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-head"><div className="card-title">⚡ Quick Actions</div></div>
        <div className="card-body">
          <div style={{ display:'flex', gap:'.9rem', flexWrap:'wrap' }}>
            {[['🛒','Shop Inputs','/dashboard/shop'],['🏛️','Browse Schemes','/dashboard/schemes'],['📦','My Orders','/dashboard/orders'],['👤','Edit Profile','/dashboard/profile']].map(([i,l,to]) => (
              <button key={l} onClick={() => nav(to)} className="btn btn-outline" style={{ flex:'1', minWidth:'160px', justifyContent:'center', padding:'.75rem' }}>
                <span style={{ fontSize:'1rem' }}>{i}</span> {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
