import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, cartAPI } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('kh_user')); } catch { return null; }
  });
  const [cart, setCart]       = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Boot: verify token and load cart
  useEffect(() => {
    const token = localStorage.getItem('kh_token');
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then(res => { setUser(res.data.user); localStorage.setItem('kh_user', JSON.stringify(res.data.user)); })
      .catch(() => { localStorage.removeItem('kh_token'); localStorage.removeItem('kh_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  // Load cart whenever user changes
  const loadCart = useCallback(async () => {
    if (!user || user.role !== 'farmer') return;
    try {
      setCartLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.cart || []);
    } catch { setCart([]); }
    finally { setCartLoading(false); }
  }, [user]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('kh_token', token);
    localStorage.setItem('kh_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { token, user: u } = res.data;
    localStorage.setItem('kh_token', token);
    localStorage.setItem('kh_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('kh_token');
    localStorage.removeItem('kh_user');
    setUser(null);
    setCart([]);
    toast.success('Logged out successfully!');
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    const u = res.data.user;
    localStorage.setItem('kh_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const addToCart = async (productId) => {
    try {
      const res = await cartAPI.add(productId);
      setCart(res.data.cart || []);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartQty = async (productId, quantity) => {
    try {
      const res = await cartAPI.update(productId, quantity);
      setCart(res.data.cart || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.remove(productId);
      setCart(res.data.cart || []);
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateProfile,
      cart, cartCount, cartTotal, cartLoading,
      addToCart, updateCartQty, removeFromCart, clearCart, loadCart
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
