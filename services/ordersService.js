const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Listing = mongoose.model('Listing');
const { chargeCard } = require('./billingService');

const orderTotal = async (itemIds) => {
  try {
    const result = await Listing.aggregate([
      { $match: { _id: { $in: itemIds } } },
      { $group: { _id: null, amount: { $sum: '$price' } } }
    ]);
    return result[0].amount;
  } catch (err) {
    throw Error('Could not calculate order total');
  }
};

const markListingsAsSold = async (itemIds) => {
  try {
    const updatedListings = await Listing.updateMany(
      { _id: { $in: itemIds } },
      { $set: { sold: true } },
      { new: true }
    );
    return updatedListings;
  } catch (err) {
    throw Error('Could not mark listings as sold');
  }
};

exports.insertOrder = async (user, items, address, paymentMethod) => {
  try {
    const total = await orderTotal(
      items.map((item) => mongoose.Types.ObjectId(item.id))
    );
    const charge = await chargeCard(paymentMethod, total);
    const updateListings = await markListingsAsSold(
      items.map((item) => mongoose.Types.ObjectId(item.id))
    );

    // console.log(updateListings);
  } catch (err) {
    console.log(err);
    throw Error('Could not insert order');
  }
};

exports.retrieveOrder = async (user, orderId) => {
  try {
    const order = await Order.findOne({ _id: orderId, seller: user.id });
    return order;
  } catch (err) {
    throw Error('Could not get order');
  }
};

exports.retrieveOrders = async (user) => {
  try {
    const orders = await Order.find({ seller: user.id });
    return orders;
  } catch (err) {
    throw Error('Could not get orders');
  }
};

exports.markOrderAsFulfilled = async (user, orderId) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, seller: user.id },
      { $set: { status: 'Shipped' } },
      { new: true }
    );
    return order;
  } catch (err) {
    throw Error('Could not mark order as fulfilled');
  }
};
