const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/orders/checkout — place order from cart
router.post('/checkout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user.cart.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });

    const items = [];
    let subtotal = 0;

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      if (!product || !product.isActive) continue;
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }
      const itemSubtotal = product.price * cartItem.quantity;
      subtotal += itemSubtotal;
      items.push({ product: product._id, name: product.name, emoji: product.emoji, price: product.price, quantity: cartItem.quantity, subtotal: itemSubtotal });
      // Reduce stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -cartItem.quantity } });
    }

    const deliveryCharge = 60;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryCharge + tax;

    const order = await Order.create({
      farmer: req.user._id,
      items,
      subtotal,
      deliveryCharge,
      tax,
      total,
      deliveryAddress: {
        village: user.village,
        district: user.district,
        state: user.state,
        pincode: req.body.pincode || ''
      }
    });

    // Clear cart
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    const populated = await Order.findById(order._id).populate('farmer', 'firstName lastName email phone');
    res.status(201).json({ success: true, message: 'Order placed successfully!', order: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/my — farmer's own orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('farmer', 'firstName lastName email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.farmer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders — admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .populate('farmer', 'firstName lastName email phone district')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status — admin: update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };
    if (status === 'delivered') updates.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, message: 'Order status updated!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
