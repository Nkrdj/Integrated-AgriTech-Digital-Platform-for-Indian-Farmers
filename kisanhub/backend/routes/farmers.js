const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, farmers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id).select('-password');
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found.' });
    res.json({ success: true, farmer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
