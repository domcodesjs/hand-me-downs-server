const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.insertOrder = async (user) => {
  try {
  } catch (err) {
    throw Error('Could not create order');
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
