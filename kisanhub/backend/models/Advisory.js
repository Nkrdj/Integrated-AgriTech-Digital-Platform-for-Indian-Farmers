const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  type:       { type: String, required: true, enum: ['pest', 'fertilizer', 'irrigation', 'disease', 'market', 'soil', 'weather', 'general'] },
  crop:       { type: String, default: 'All Crops' },
  content:    { type: String, required: true },
  severity:   { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isActive:   { type: Boolean, default: true },
  targetStates: [{ type: String }],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  viewCount:  { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Advisory', advisorySchema);
