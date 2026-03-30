const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  ministry:    { type: String, required: true },
  emoji:       { type: String, default: '🏛️' },
  category:    { type: String, enum: ['insurance', 'subsidy', 'loan', 'equipment', 'direct_benefit', 'other'], default: 'other' },
  description: { type: String, required: true },
  benefits:    { type: String, default: '' },
  eligibility: { type: String, default: '' },
  tags:        [{ type: String }],
  deadline:    { type: String, default: 'Ongoing' },
  applyUrl:    { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const SchemeApplication = new mongoose.Schema({
  farmer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme:     { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  status:     { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'pending' },
  notes:      { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date
}, { timestamps: true });

const mandiPriceSchema = new mongoose.Schema({
  crop:     { type: String, required: true },
  emoji:    { type: String, default: '🌾' },
  price:    { type: Number, required: true },
  unit:     { type: String, default: 'per quintal' },
  market:   { type: String, required: true },
  state:    { type: String, default: 'Tamil Nadu' },
  date:     { type: Date, default: Date.now },
  change:   { type: Number, default: 0 },
  prevPrice:{ type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  Scheme: mongoose.model('Scheme', schemeSchema),
  SchemeApplication: mongoose.model('SchemeApplication', SchemeApplication),
  MandiPrice: mongoose.model('MandiPrice', mandiPriceSchema)
};
