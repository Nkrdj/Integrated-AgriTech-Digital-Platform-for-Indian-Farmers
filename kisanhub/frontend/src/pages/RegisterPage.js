import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { AuthShell } from './LoginPage';

const STATES = ['Tamil Nadu','Maharashtra','Punjab','Andhra Pradesh','Karnataka','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','West Bengal'];
const CROPS  = ['Rice','Wheat','Maize','Cotton','Sugarcane','Vegetables','Groundnut','Soybean','Pulses','Other'];
const LANGS  = ['English','Tamil','Hindi','Telugu','Kannada','Marathi'];

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', state:'Tamil Nadu', district:'', village:'', primaryCrop:'Rice', landAcres:'', language:'English' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const user = await register({ ...form, landAcres: parseFloat(form.landAcres) || 0 });
      toast.success(`Welcome to KisanHub, ${user.firstName}!`);
      nav('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Create your account" sub="Join 12,800+ farmers on KisanHub">
      <form onSubmit={submit}>
        <div className="form-row">
          <div className="form-group"><label>First Name</label><input name="firstName" value={form.firstName} onChange={handle} placeholder="e.g. Ravi" required /></div>
          <div className="form-group"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={handle} placeholder="e.g. Kumar" required /></div>
        </div>
        <div className="form-group"><label>Phone Number</label><input name="phone" value={form.phone} onChange={handle} placeholder="+91 9XXXXXXXXX" required /></div>
        <div className="form-group"><label>Email</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required /></div>
        <div className="form-row">
          <div className="form-group"><label>State</label><select name="state" value={form.state} onChange={handle}>{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="form-group"><label>District</label><input name="district" value={form.district} onChange={handle} placeholder="e.g. Coimbatore" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Primary Crop</label><select name="primaryCrop" value={form.primaryCrop} onChange={handle}>{CROPS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label>Land (Acres)</label><input name="landAcres" type="number" step="0.1" min="0" value={form.landAcres} onChange={handle} placeholder="e.g. 3.5" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Language</label><select name="language" value={form.language} onChange={handle}>{LANGS.map(l => <option key={l}>{l}</option>)}</select></div>
          <div className="form-group"><label>Password</label><input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required /></div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'.85rem', marginTop:'.3rem' }} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account & Enter →'}
        </button>
      </form>
      <p style={{ textAlign:'center', fontSize:'.83rem', color:'var(--ink-soft)', marginTop:'1rem' }}>
        Already registered? <Link to="/login" style={{ color:'var(--leaf)', fontWeight:700 }}>Login here</Link>
      </p>
    </AuthShell>
  );
}
