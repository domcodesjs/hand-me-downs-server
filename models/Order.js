const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
  total: {
    type: Number,
    required: true
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: 'Listing',
    required: true
  },
  shipping_address: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    defalt: Date.now,
    required: true
  },
  status: {
    type: String,
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

module.exports = mongoose.model('Order', Order);
