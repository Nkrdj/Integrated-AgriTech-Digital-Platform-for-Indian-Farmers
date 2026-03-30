const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ['seeds', 'fertilizer', 'pesticide', 'equipment'] },
  emoji:       { type: String, default: '🌱' },
  imageUrl:    { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, required: true },
  stock:       { type: Number, required: true, default: 0, min: 0 },
  description: { type: String, default: '' },
  brand:       { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

productSchema.virtual('stockLevel').get(function() {
  if (this.stock === 0) return 'out';
  if (this.stock <= 15) return 'low';
  return 'in';
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
