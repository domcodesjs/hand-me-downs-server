const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Listing = new Schema({
  title: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  sold: {
    type: Boolean,
    default: false,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

Listing.virtual('id').get(function () {
  return this._id.toHexString();
});

Listing.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Listing', Listing);
