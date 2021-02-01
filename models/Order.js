const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
  items: [{ type: Schema.Types.ObjectId, ref: 'Listing', required: true }],
  shipping_address: {
    type: Object,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  shipped: {
    type: Boolean,
    default: false,
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
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

Order.virtual('id').get(function () {
  return this._id.toHexString();
});

Order.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Order', Order);
