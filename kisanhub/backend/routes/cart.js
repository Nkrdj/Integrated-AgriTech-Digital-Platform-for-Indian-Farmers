const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/cart — get current user cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product', 'name price emoji unit stock isActive');
    const validCart = user.cart.filter(item => item.product && item.product.isActive);
    res.json({ success: true, cart: validCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cart/add — add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock.' });

    const user = await User.findById(req.user._id);
    const existingIdx = user.cart.findIndex(i => i.product.toString() === productId);
    if (existingIdx >= 0) {
      user.cart[existingIdx].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product', 'name price emoji unit stock');
    res.json({ success: true, message: 'Added to cart!', cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/update — change quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex(i => i.product.toString() === productId);
    if (idx < 0) return res.status(404).json({ success: false, message: 'Item not in cart.' });
    if (quantity <= 0) {
      user.cart.splice(idx, 1);
    } else {
      user.cart[idx].quantity = quantity;
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product', 'name price emoji unit stock');
    res.json({ success: true, message: 'Cart updated!', cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product', 'name price emoji unit stock');
    res.json({ success: true, message: 'Removed from cart.', cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
