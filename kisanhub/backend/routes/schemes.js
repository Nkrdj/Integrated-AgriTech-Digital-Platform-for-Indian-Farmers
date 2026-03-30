const express = require('express');
const router = express.Router();
const { Scheme, SchemeApplication } = require('../models/Scheme');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, schemes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Scheme added!', scheme });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Scheme updated!', scheme });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Scheme.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Scheme removed.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/schemes/:id/apply
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const existing = await SchemeApplication.findOne({ farmer: req.user._id, scheme: req.params.id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied for this scheme.' });
    const app = await SchemeApplication.create({ farmer: req.user._id, scheme: req.params.id });
    res.status(201).json({ success: true, message: 'Application submitted!', application: app });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/schemes/applications — admin: all applications
router.get('/applications/all', protect, adminOnly, async (req, res) => {
  try {
    const apps = await SchemeApplication.find()
      .populate('farmer', 'firstName lastName district state')
      .populate('scheme', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/schemes/applications/:id — admin: approve/reject
router.put('/applications/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const app = await SchemeApplication.findByIdAndUpdate(
      req.params.id,
      { status, notes, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, message: `Application ${status}!`, application: app });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
