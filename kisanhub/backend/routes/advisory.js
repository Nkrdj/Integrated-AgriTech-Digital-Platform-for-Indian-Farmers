// ── advisory.js ─────────────────────────────────────────
const express = require('express');
const router = express.Router();
const Advisory = require('../models/Advisory');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { crop, type } = req.query;
    const query = { isActive: true };
    if (crop && crop !== 'all') query.crop = { $regex: crop, $options: 'i' };
    if (type) query.type = type;
    const advisories = await Advisory.find(query).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, advisories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const advisory = await Advisory.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Advisory published!', advisory });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const advisory = await Advisory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Advisory updated!', advisory });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Advisory.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Advisory removed.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
