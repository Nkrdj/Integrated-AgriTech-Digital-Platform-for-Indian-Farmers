// LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}!`);
      nav(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return <AuthShell title="Welcome back" sub="Log in to KisanHub">
    <div style={{ background:'#fef8e7', border:'1px solid rgba(201,146,26,.2)', borderRadius:'8px', padding:'.7rem 1rem', marginBottom:'1.2rem', fontSize:'.8rem', color:'#633806', lineHeight:1.55 }}>
      <strong>Demo accounts:</strong><br/>
      🌾 Farmer: farmer@example.com / password123<br/>
      🛡️ Admin: admin@example.com / password123
    </div>
    {error && (
      <div style={{ background:'var(--red-pale)', color:'var(--red)', border:'1px solid rgba(192,57,43,.15)', borderRadius:'12px', padding:'.8rem 1rem', marginBottom:'1.2rem', fontSize:'.85rem', display:'flex', alignItems:'center', gap:'.6rem', fontWeight:600 }}>
        <span>⚠️</span> {error}
      </div>
    )}
    <form onSubmit={submit}>
      <div className="form-group"><label>Email</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required /></div>
      <div className="form-group"><label>Password</label><input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required /></div>
      <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'.85rem', marginTop:'.3rem' }} disabled={loading}>
        {loading ? 'Logging in…' : 'Login to KisanHub →'}
      </button>
    </form>
    <p style={{ textAlign:'center', fontSize:'.83rem', color:'var(--ink-soft)', marginTop:'1rem' }}>
      Don't have an account? <Link to="/register" style={{ color:'var(--leaf)', fontWeight:700 }}>Register here</Link>
    </p>
  </AuthShell>;
}

// ── Shared auth shell ────────────────────────────────────
export function AuthShell({ title, sub, children }) {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1b3a1f,#0d2e0d)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'#fff', borderRadius:'20px', width:'100%', maxWidth:'430px', overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.3)' }}>
        <div style={{ background:'linear-gradient(135deg,#2d5a34,#1b3a1f)', padding:'2rem 2rem 1.6rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:'1.5rem', top:'1rem', fontSize:'5rem', opacity:.07, lineHeight:1 }}>🌾</div>
          <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontSize:'1.4rem', fontWeight:900, color:'#fff', letterSpacing:'-.02em' }}>
            Kisan<span style={{ color:'#f0b840' }}>Hub</span>
          </Link>
          <div style={{ color:'rgba(255,255,255,.5)', fontSize:'.82rem', marginTop:'.3rem' }}>Integrated AgriTech Platform</div>
        </div>
        <div style={{ padding:'2rem' }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'1.3rem', fontWeight:800, color:'var(--forest)', marginBottom:'.25rem' }}>{title}</h2>
          <p style={{ fontSize:'.83rem', color:'var(--ink-soft)', marginBottom:'1.5rem' }}>{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
