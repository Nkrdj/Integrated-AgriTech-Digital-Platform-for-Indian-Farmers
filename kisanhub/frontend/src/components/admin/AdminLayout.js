import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to:'/admin',          icon:'📊', label:'Dashboard', end:true },
  { to:'/admin/farmers',  icon:'🌾', label:'Farmers'   },
  { to:'/admin/products', icon:'🏷️', label:'Products'  },
  { to:'/admin/orders',   icon:'📦', label:'Orders'    },
  { to:'/admin/advisory', icon:'🌱', label:'Advisory'  },
  { to:'/admin/schemes',  icon:'🏛️', label:'Schemes'   },
  { to:'/admin/prices',   icon:'📈', label:'Prices'    },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <nav style={{ width:'var(--sidebar-w)', background:'#111c14', position:'fixed', inset:'0 auto 0 0', display:'flex', flexDirection:'column', zIndex:100, overflowY:'auto' }}>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.2rem', fontWeight:900, color:'#fff' }}>
            Kisan<span style={{ color:'var(--amber)' }}>Hub</span>
            <span style={{ display:'block', fontSize:'.64rem', fontWeight:400, color:'rgba(255,255,255,.35)', letterSpacing:'.1em', textTransform:'uppercase', marginTop:'2px' }}>Admin Panel</span>
          </div>
        </div>
        <div style={{ padding:'.8rem 1.4rem .5rem', display:'flex', alignItems:'center', gap:'.7rem', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--forest)', fontSize:'.85rem', flexShrink:0 }}>{user?.firstName?.[0]}</div>
          <div>
            <div style={{ color:'#fff', fontWeight:600, fontSize:'.85rem' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ color:'rgba(255,255,255,.4)', fontSize:'.7rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Administrator</div>
          </div>
        </div>
        <div style={{ flex:1 }}>
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({ display:'flex', alignItems:'center', gap:'.7rem', padding:'.6rem 1.4rem', color: isActive ? '#fff' : 'rgba(255,255,255,.6)', background: isActive ? 'rgba(255,255,255,.1)' : 'transparent', borderLeft:'3px solid ' + (isActive ? 'var(--amber)' : 'transparent'), fontSize:'.88rem', fontWeight:500, transition:'all .15s', textDecoration:'none', margin:'.05rem 0' })}>
              <span style={{ fontSize:'.95rem', width:'20px', textAlign:'center' }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid rgba(255,255,255,.07)' }}>
          <button onClick={logout} style={{ width:'100%', padding:'.55rem', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'8px', color:'rgba(255,255,255,.55)', fontSize:'.83rem', fontWeight:600, cursor:'pointer' }}>Logout</button>
        </div>
      </nav>
      <div style={{ marginLeft:'var(--sidebar-w)', flex:1 }}>
        <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'.85rem 1.8rem', position:'sticky', top:0, zIndex:50, display:'flex', alignItems:'center', boxShadow:'var(--shadow)' }}>
          <div style={{ background:'var(--amber-pale)', border:'1px solid rgba(201,146,26,.25)', borderRadius:'8px', padding:'.38rem .85rem', fontSize:'.8rem', fontWeight:700, color:'var(--gold)' }}>Admin Mode</div>
          <div style={{ marginLeft:'auto', fontSize:'.83rem', color:'var(--ink-soft)' }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <Outlet/>
      </div>
    </div>
  );
}
