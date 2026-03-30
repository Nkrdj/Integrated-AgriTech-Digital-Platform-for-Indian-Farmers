const express = require('express');
const router = express.Router();
const { MandiPrice } = require('../models/Scheme');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { state, market } = req.query;
    const query = {};
    if (state) query.state = state;
    if (market) query.market = { $regex: market, $options: 'i' };
    const prices = await MandiPrice.find(query).sort({ date: -1, crop: 1 });
    res.json({ success: true, prices });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const price = await MandiPrice.create(req.body);
    res.status(201).json({ success: true, price });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const price = await MandiPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, price });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await MandiPrice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Price entry removed.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
