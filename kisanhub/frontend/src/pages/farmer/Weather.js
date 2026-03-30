import React, { useEffect, useState } from 'react';
import { weatherAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function WeatherPage() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [city, setCity]       = useState(user?.district || 'Coimbatore');
  const [input, setInput]     = useState(city);
  const [loading, setLoading] = useState(true);

  const load = (c) => {
    setLoading(true);
    weatherAPI.get(c).then(r => { setWeather(r.data.weather); setCity(c); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(city); }, []); // eslint-disable-line

  const ICON_MAP = { '01d':'☀️','01n':'🌙','02d':'⛅','02n':'🌙','03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️','09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️','11d':'⛈️','13d':'❄️','50d':'🌫️' };
  const ico = (code) => ICON_MAP[code] || '🌤️';

  return (
    <div className="page-wrap">
      <div className="page-hdr">
        <div className="page-hdr-title">🌤️ Weather Forecast</div>
        <div style={{ display:'flex', gap:'.5rem' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(input)} placeholder="Enter city" style={{ padding:'.45rem .9rem', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'.88rem', outline:'none', width:'180px' }}/>
          <button className="btn btn-success btn-sm" onClick={() => load(input)}>Search</button>
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner"/></div> : weather && (<>
        <div style={{ background:'linear-gradient(135deg,#0d47a1,#1976d2)', borderRadius:'var(--r)', padding:'2rem', color:'#fff', display:'flex', alignItems:'center', gap:'2rem', marginBottom:'1.2rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
            <div style={{ fontSize:'5rem' }}>{ico(weather.icon)}</div>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:'4rem', fontWeight:900, lineHeight:1 }}>{weather.temp}°C</div>
              <div style={{ opacity:.7, textTransform:'capitalize' }}>{weather.description}</div>
              <div style={{ opacity:.5, fontSize:'.82rem', marginTop:'.3rem' }}>📍 {weather.city}</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.8rem', marginLeft:'auto' }}>
            {[['💧',`${weather.humidity}%`,'Humidity'],['💨',`${weather.wind_speed} km/h`,'Wind'],['🌧️',`${weather.rain_chance}%`,'Rain Chance'],['🌡️',`${weather.feels_like}°C`,'Feels Like'],['⬆️',`${weather.max_temp}°C`,'Max'],['⬇️',`${weather.min_temp}°C`,'Min']].map(([icon,val,lbl]) => (
              <div key={lbl} style={{ background:'rgba(255,255,255,.12)', borderRadius:'10px', padding:'.8rem 1.1rem', textAlign:'center' }}>
                <div style={{ fontSize:'1rem' }}>{icon}</div>
                <div style={{ fontWeight:800 }}>{val}</div>
                <div style={{ fontSize:'.7rem', opacity:.65, marginTop:'2px' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">📅 7-Day Forecast</div></div>
          <div className="card-body">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'.8rem' }}>
              {weather.forecast?.map((f,i) => (
                <div key={i} style={{ background:'var(--parchment)', borderRadius:'11px', padding:'.8rem', textAlign:'center', border:'1px solid var(--border-soft)' }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:'var(--ink-soft)', marginBottom:'.4rem' }}>{f.day}</div>
                  <div style={{ fontSize:'1.6rem', marginBottom:'.3rem' }}>{ico(f.icon)}</div>
                  <div style={{ fontWeight:800, fontSize:'.9rem', color:'var(--forest)' }}>{f.temp}°C</div>
                  <div style={{ fontSize:'.71rem', color:'var(--sky)', marginTop:'.2rem' }}>💧 {f.rain}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {weather.alerts?.length > 0 && (
          <div className="card">
            <div className="card-head"><div className="card-title">🌾 Farming Alerts</div></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {weather.alerts.map((a,i) => {
                const styles = { warn:{ bg:'var(--amber-pale)', border:'rgba(201,146,26,.25)', titleColor:'var(--gold)' }, info:{ bg:'var(--sky-pale)', border:'#bee3f8', titleColor:'var(--sky)' }, good:{ bg:'#e8f5e9', border:'#c8e6ca', titleColor:'#2e7d32' } };
                const s = styles[a.type] || styles.info;
                return (
                  <div key={i} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:'10px', padding:'.9rem 1.1rem', display:'flex', gap:'.8rem' }}>
                    <span style={{ fontSize:'1.2rem' }}>{a.type==='warn'?'⚠️':a.type==='good'?'✅':'💡'}</span>
                    <div><div style={{ fontWeight:700, fontSize:'.88rem', color:s.titleColor, marginBottom:'.25rem' }}>{a.title}</div><div style={{ fontSize:'.83rem', color:'var(--ink-mid)' }}>{a.message}</div></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}
