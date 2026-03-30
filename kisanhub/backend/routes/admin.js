const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Advisory = require('../models/Advisory');
const { Scheme, SchemeApplication } = require('../models/Scheme');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalFarmers, activeOrders, pendingSchemes,
      totalRevenue, totalAdvisories, totalProducts, monthlyOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      Order.countDocuments({ status: { $in: ['pending','processing','shipped','out_for_delivery'] } }),
      SchemeApplication.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Advisory.countDocuments({ isActive: true }),
      require('../models/Product').countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalFarmers,
        activeOrders,
        pendingSchemes,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalAdvisories,
        totalProducts,
        monthlyOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/farmers
router.get('/farmers', protect, adminOnly, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = { role: 'farmer' };
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (search) query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName:  { $regex: search, $options: 'i' } },
      { email:     { $regex: search, $options: 'i' } },
      { phone:     { $regex: search, $options: 'i' } }
    ];
    const farmers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ success: true, farmers, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/farmers/:id — toggle active/approved
router.put('/farmers/:id', protect, adminOnly, async (req, res) => {
  try {
    const farmer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, message: 'Farmer updated!', farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/farmers/:id
router.delete('/farmers/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Farmer deactivated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
