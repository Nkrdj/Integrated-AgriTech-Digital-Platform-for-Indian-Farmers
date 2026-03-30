import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

const STATES = ['Tamil Nadu','Maharashtra','Punjab','Andhra Pradesh','Karnataka','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','West Bengal'];
const CROPS  = ['Rice','Wheat','Maize','Cotton','Sugarcane','Vegetables','Groundnut','Soybean','Pulses','Other'];
const LANGS  = ['English','Tamil','Hindi','Telugu','Kannada','Marathi'];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName||'', lastName: user?.lastName||'', phone: user?.phone||'', state: user?.state||'', district: user?.district||'', village: user?.village||'', primaryCrop: user?.primaryCrop||'', landAcres: user?.landAcres||'', language: user?.language||'' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const handle   = e => setForm(f => ({...f, [e.target.name]: e.target.value}));
  const handlePw = e => setPwForm(f => ({...f, [e.target.name]: e.target.value}));

  const saveProfile = async e => {
    e.preventDefault(); setSaving(true);
    try { await updateProfile({...form, landAcres: parseFloat(form.landAcres)||0}); toast.success('Profile updated!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed.'); }
    finally { setSaving(false); }
  };

  const changePw = async e => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('Min 6 characters.');
    setPwSaving(true);
    try { await authAPI.changePassword(pwForm); toast.success('Password changed!'); setPwForm({ currentPassword:'', newPassword:'' }); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setPwSaving(false); }
  };

  return (
    <div className="page-wrap">
      <div className="card">
        <div style={{ background:'linear-gradient(135deg,var(--forest),var(--forest-mid))', borderRadius:'var(--r) var(--r) 0 0', padding:'1.8rem', display:'flex', alignItems:'center', gap:'1.2rem' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'var(--leaf)', border:'3px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Fraunces',serif", fontSize:'1.6rem', fontWeight:900, color:'#fff' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.2rem', fontWeight:900, color:'#fff' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ color:'rgba(255,255,255,.5)', fontSize:'.82rem' }}>{user?.email}</div>
          </div>
        </div>
        <form onSubmit={saveProfile} style={{ padding:'1.4rem' }}>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input name="firstName" value={form.firstName} onChange={handle} required/></div>
            <div className="form-group"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={handle} required/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handle}/></div>
            <div className="form-group"><label>Village</label><input name="village" value={form.village} onChange={handle}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>State</label><select name="state" value={form.state} onChange={handle}>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>District</label><input name="district" value={form.district} onChange={handle}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Primary Crop</label><select name="primaryCrop" value={form.primaryCrop} onChange={handle}>{CROPS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Land (Acres)</label><input name="landAcres" type="number" step="0.1" value={form.landAcres} onChange={handle}/></div>
          </div>
          <div className="form-group" style={{maxWidth:'260px'}}><label>Language</label><select name="language" value={form.language} onChange={handle}>{LANGS.map(l=><option key={l}>{l}</option>)}</select></div>
          <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Change Password</div></div>
        <form onSubmit={changePw} style={{ padding:'1.2rem' }}>
          <div className="form-row">
            <div className="form-group"><label>Current Password</label><input name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePw} required/></div>
            <div className="form-group"><label>New Password</label><input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePw} required/></div>
          </div>
          <button type="submit" className="btn btn-outline" disabled={pwSaving}>{pwSaving ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>
    </div>
  );
}
