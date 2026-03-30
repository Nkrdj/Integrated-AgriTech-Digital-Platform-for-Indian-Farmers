import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api';
import toast from 'react-hot-toast';

const NAV = [
  { to:'/dashboard',          icon:'🏠', label:'Dashboard'    },
  { to:'/dashboard/shop',     icon:'🛒', label:'Shop Inputs'  },
  { to:'/dashboard/advisory', icon:'🌱', label:'Crop Advisory'},
  { to:'/dashboard/weather',  icon:'🌤️', label:'Weather'      },
  { to:'/dashboard/prices',   icon:'📊', label:'Mandi Prices' },
  { to:'/dashboard/schemes',  icon:'🏛️', label:'Gov Schemes'  },
  { to:'/dashboard/orders',   icon:'📦', label:'My Orders'    },
  { to:'/dashboard/profile',  icon:'👤', label:'My Profile'   },
];

export default function FarmerLayout() {
  const { user, logout, cart, cartCount, cartTotal, updateCartQty, removeFromCart, clearCart } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const nav = useNavigate();

  const doCheckout = async () => {
    if (!cart.length) return;
    setCheckingOut(true);
    try {
      const res = await ordersAPI.checkout({});
      clearCart();
      setCartOpen(false);
      toast.success(`Order ${res.data.order.orderNumber} placed!`);
      nav('/dashboard/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed.');
    } finally { setCheckingOut(false); }
  };

  const deliveryCharge = 60;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryCharge + tax;

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sidebar */}
      <nav style={{ width:'var(--sidebar-w)', background:'var(--forest)', position:'fixed', inset:'0 auto 0 0', display:'flex', flexDirection:'column', zIndex:100, overflowY:'auto' }}>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.25rem', fontWeight:900, color:'#fff', letterSpacing:'-.02em' }}>
            Kisan<span style={{ color:'var(--amber)' }}>Hub</span>
          </div>
        </div>
        <div style={{ padding:'.8rem 1.4rem .5rem', display:'flex', alignItems:'center', gap:'.7rem', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'var(--leaf)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff', fontSize:'.9rem', flexShrink:0 }}>
            {user?.firstName?.[0]}
          </div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ color:'#fff', fontWeight:600, fontSize:'.85rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ color:'rgba(255,255,255,.4)', fontSize:'.71rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Farmer</div>
          </div>
        </div>
        <div style={{ flex:1 }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to==='/dashboard'}
              style={({ isActive }) => ({ display:'flex', alignItems:'center', gap:'.7rem', padding:'.6rem 1.4rem', color: isActive ? '#fff' : 'rgba(255,255,255,.6)', background: isActive ? 'rgba(255,255,255,.1)' : 'transparent', borderLeft:`3px solid ${isActive ? 'var(--amber)' : 'transparent'}`, fontSize:'.88rem', fontWeight:500, transition:'all .15s', textDecoration:'none', margin:'.05rem 0' })}>
              <span style={{ fontSize:'.95rem', width:'20px', textAlign:'center' }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid rgba(255,255,255,.07)' }}>
          <button onClick={logout} style={{ width:'100%', padding:'.55rem', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'8px', color:'rgba(255,255,255,.55)', fontSize:'.83rem', fontWeight:600, cursor:'pointer' }}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div style={{ marginLeft:'var(--sidebar-w)', flex:1, display:'flex', flexDirection:'column' }}>
        {/* Topbar */}
        <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'.85rem 1.8rem', position:'sticky', top:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'.8rem', boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.5rem', background:'var(--sky-pale)', border:'1px solid #bee3f8', borderRadius:'8px', padding:'.4rem .85rem', fontSize:'.83rem', fontWeight:600, color:'var(--sky)' }}>
            ⛅ Weather: Coimbatore
          </div>
          <button onClick={() => setCartOpen(true)} style={{ position:'relative', background:'var(--leaf)', color:'#fff', border:'none', borderRadius:'9px', padding:'.52rem 1.1rem', fontSize:'.88rem', fontWeight:700, display:'flex', alignItems:'center', gap:'.45rem', cursor:'pointer' }}>
            🛒 Cart
            {cartCount > 0 && <span style={{ position:'absolute', top:'-7px', right:'-7px', width:'19px', height:'19px', borderRadius:'50%', background:'var(--red)', color:'#fff', fontSize:'.68rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</span>}
          </button>
        </div>

        {/* Page content */}
        <div style={{ flex:1 }}><Outlet /></div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', zIndex:200 }} onClick={() => setCartOpen(false)} />}
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'390px', maxWidth:'96vw', background:'#fff', zIndex:201, display:'flex', flexDirection:'column', boxShadow:'-4px 0 32px rgba(0,0,0,.14)', transform: cartOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.1rem', fontWeight:700, color:'var(--forest)' }}>🛒 Shopping Cart</div>
          <button onClick={() => setCartOpen(false)} style={{ background:'none', border:'none', fontSize:'1.1rem', color:'var(--ink-soft)', cursor:'pointer' }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'.9rem 1.2rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--ink-soft)' }}>
              <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>🛒</div>
              <div style={{ fontWeight:600, marginBottom:'.3rem' }}>Cart is empty</div>
              <div style={{ fontSize:'.83rem' }}>Browse the shop and add items</div>
            </div>
          ) : cart.map(item => (
            <div key={item.product?._id} style={{ display:'flex', gap:'.9rem', padding:'.9rem 0', borderBottom:'1px solid var(--border-soft)', alignItems:'flex-start' }}>
              <div style={{ width:'50px', height:'50px', background:'var(--sage)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>{item.product?.emoji || '🌱'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:'.9rem' }}>{item.product?.name}</div>
                <div style={{ color:'var(--forest)', fontWeight:700, fontSize:'.86rem', marginTop:'2px' }}>₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginTop:'.5rem' }}>
                  <button onClick={() => updateCartQty(item.product._id, item.quantity - 1)} style={{ width:'26px', height:'26px', borderRadius:'7px', border:'1.5px solid var(--border)', background:'#fff', fontWeight:700, cursor:'pointer' }}>−</button>
                  <span style={{ fontWeight:800, minWidth:'22px', textAlign:'center' }}>{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.product._id, item.quantity + 1)} style={{ width:'26px', height:'26px', borderRadius:'7px', border:'1.5px solid var(--border)', background:'#fff', fontWeight:700, cursor:'pointer' }}>+</button>
                  <button onClick={() => removeFromCart(item.product._id)} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--red)', fontSize:'.78rem', fontWeight:700, cursor:'pointer' }}>🗑 Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding:'1.2rem 1.4rem', borderTop:'1px solid var(--border)' }}>
            {[['Subtotal', `₹${cartTotal.toLocaleString('en-IN')}`],['Delivery','₹60'],['GST (5%)',`₹${tax}`]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:'.88rem', padding:'.3rem 0', color:'var(--ink-soft)' }}><span>{l}</span><span>{v}</span></div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:'1rem', color:'var(--forest)', borderTop:'1.5px solid var(--border)', marginTop:'.4rem', paddingTop:'.7rem' }}><span>Total Payable</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
            <button onClick={doCheckout} disabled={checkingOut} style={{ width:'100%', padding:'.9rem', marginTop:'1rem', border:'none', borderRadius:'10px', background:'linear-gradient(135deg,var(--forest),var(--forest-mid))', color:'#fff', fontSize:'.95rem', fontWeight:800, cursor:'pointer' }}>
              {checkingOut ? 'Placing order…' : 'Checkout — Pay Now →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
