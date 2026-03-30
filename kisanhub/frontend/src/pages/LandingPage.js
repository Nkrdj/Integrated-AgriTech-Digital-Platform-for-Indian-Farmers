import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1b3a1f 0%,#0d2e0d 50%,#1a3d00 100%)', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.2rem 4rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.6rem', fontWeight:900, color:'#fff', letterSpacing:'-.03em' }}>
          Kisan<span style={{ color:'#f0b840' }}>Hub</span>
        </div>
        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={() => nav('/login')} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'#fff', padding:'.55rem 1.3rem', borderRadius:'8px', fontSize:'.9rem', fontWeight:600, cursor:'pointer' }}>Log In</button>
          <button onClick={() => nav('/register')} style={{ background:'#f0b840', border:'none', color:'#1b3a1f', padding:'.55rem 1.4rem', borderRadius:'8px', fontSize:'.9rem', fontWeight:700, cursor:'pointer' }}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding:'6rem 4rem 4rem', maxWidth:'800px', margin:'0 auto', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(240,184,64,.15)', border:'1px solid rgba(240,184,64,.3)', borderRadius:'100px', padding:'.3rem 1rem', color:'#f0b840', fontSize:'.75rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#f0b840', display:'inline-block' }}/>
          India's Most Complete AgriTech Platform
        </div>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:900, lineHeight:1.08, color:'#fff', letterSpacing:'-.03em', marginBottom:'1.4rem' }}>
          One Platform for Every<br/><span style={{ color:'#7dcb85' }}>Farm Decision</span>
        </h1>
        <p style={{ fontSize:'1.05rem', lineHeight:1.8, color:'rgba(255,255,255,.55)', maxWidth:'560px', margin:'0 auto 2.5rem' }}>
          Weather forecasts, live mandi prices, crop advisories, government schemes, and an input marketplace — all in one place, built for India's farmers.
        </p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => nav('/register')} style={{ background:'#f0b840', border:'none', color:'#1b3a1f', padding:'.9rem 2rem', borderRadius:'10px', fontSize:'1rem', fontWeight:700, cursor:'pointer' }}>Start for Free →</button>
          <button onClick={() => nav('/login')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,.25)', color:'rgba(255,255,255,.75)', padding:'.9rem 1.8rem', borderRadius:'10px', fontSize:'.92rem', cursor:'pointer' }}>Login to Dashboard</button>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:'3rem', justifyContent:'center', marginTop:'4rem', paddingTop:'2.5rem', borderTop:'1px solid rgba(255,255,255,.1)' }}>
          {[['12,800+','Farmers Enrolled'],['18 States','Coverage Across India'],['₹4.2Cr','Inputs Sold This Year']].map(([v,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.8rem', fontWeight:900, color:'#fff' }}>{v}</div>
              <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.4)', marginTop:'3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background:'#f2ede4', padding:'5rem 4rem' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{ fontSize:'.75rem', fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', color:'#4a9e54', marginBottom:'.6rem' }}>What's Included</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'2.2rem', fontWeight:900, color:'#1b3a1f', letterSpacing:'-.02em' }}>Everything a Farmer Needs</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.1rem', maxWidth:'1100px', margin:'0 auto' }}>
          {[
            ['🌦️','Weather Dashboard','7-day hyper-local forecasts with farm-specific alerts.'],
            ['📊','Live Mandi Prices','Real-time crop prices from nearby APMCs.'],
            ['🌱','Crop Advisories','Expert pest, fertilizer, and irrigation guidance.'],
            ['🏛️','Government Schemes','Browse and apply for subsidies in one click.'],
            ['🛒','Input Marketplace','Buy seeds, fertilizers, and equipment online.'],
            ['📦','Order Tracking','Track purchases from order to doorstep delivery.'],
            ['🛡️','Admin Panel','Full management for admins — users, products, analytics.'],
            ['🌐','Multilingual','Available in Tamil, Hindi, Telugu and more.'],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ background:'#fff', borderRadius:'12px', padding:'1.5rem', border:'1px solid #eef3ee', transition:'all .2s', cursor:'default' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 24px rgba(27,58,31,.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
              <div style={{ fontSize:'1.8rem', marginBottom:'1rem' }}>{icon}</div>
              <div style={{ fontWeight:700, color:'#1b3a1f', marginBottom:'.4rem' }}>{title}</div>
              <div style={{ fontSize:'.83rem', color:'#6b7a6b', lineHeight:1.65 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', marginTop:'3rem' }}>
          <button onClick={() => nav('/register')} style={{ background:'#1b3a1f', color:'#fff', border:'none', padding:'1rem 2.5rem', borderRadius:'10px', fontSize:'1rem', fontWeight:700, cursor:'pointer' }}>
            Create Your Free Account →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:'#1b3a1f', padding:'2rem 4rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.1rem', fontWeight:900, color:'#f0b840' }}>KisanHub</div>
        <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.35)' }}>Integrated AgriTech Digital Platform · Jai Shriram Engineering College, Coimbatore</div>
      </div>
    </div>
  );
}
