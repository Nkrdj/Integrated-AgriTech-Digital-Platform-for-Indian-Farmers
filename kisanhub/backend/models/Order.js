const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:        { type: String, required: true },
  emoji:       { type: String },
  price:       { type: Number, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  subtotal:    { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  farmer:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber:    { type: String, unique: true },
  items:          [orderItemSchema],
  subtotal:       { type: Number, required: true },
  deliveryCharge: { type: Number, default: 60 },
  tax:            { type: Number, required: true },
  total:          { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusStep:     { type: Number, default: 0 },
  deliveryAddress: {
    village:  String,
    district: String,
    state:    String,
    pincode:  String
  },
  notes:          { type: String, default: '' },
  deliveredAt:    Date
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

// Map status to step number
orderSchema.pre('save', function(next) {
  const statusMap = { pending: 0, processing: 1, shipped: 2, out_for_delivery: 3, delivered: 4 };
  this.statusStep = statusMap[this.status] ?? 0;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
