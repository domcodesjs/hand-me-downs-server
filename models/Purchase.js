const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Purchase = new Schema({
  total: {
    type: Number,
    required: true
  },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }],
  shipping_address: {
    type: Object,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  stripe_id: {
    type: String,
    required: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

Purchase.virtual('id').get(function () {
  return this._id.toHexString();
});

Purchase.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Purchase', Purchase);
