const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Listing = mongoose.model('Listing');
const { chargeCard } = require('./billingService');
const { insertPurchase } = require('./purchasesService');

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

const seperateOrders = async (items) => {
  try {
    let sellers = {};
    for (let i = 0; i < items.length; i++) {
      if (!sellers.hasOwnProperty(items[i].user._id)) {
        sellers[items[i].user._id] = {
          items: [mongoose.Types.ObjectId(items[i].id)]
        };
      } else {
        sellers[items[i].user._id]['items'].push(
          mongoose.Types.ObjectId(items[i].id)
        );
      }
    }
    return sellers;
  } catch (err) {
    throw Error('Could not create orders');
  }
};

const insertOrders = async (user, seperatedOrders, address, charge) => {
  try {
    let orders = [];

    for (let key in seperatedOrders) {
      orders.push({
        items: seperatedOrders[key]['items'],
        shipping_address: address,
        stripe_id: charge.id,
        buyer: user.id,
        seller: key
      });
    }

    const allTheOrders = await Order.insertMany(orders);
    const allTheOrderIds = allTheOrders.map((order) =>
      mongoose.Types.ObjectId(order._id)
    );

    return allTheOrderIds;
  } catch (err) {
    throw Error('Could not create orders');
  }
};

exports.insertOrder = async (user, items, address, paymentMethod) => {
  try {
    const itemIds = items.map((item) => mongoose.Types.ObjectId(item.id));
    const total = await orderTotal(itemIds);
    const charge = await chargeCard(paymentMethod, total);
    await markListingsAsSold(itemIds);
    const seperatedOrders = await seperateOrders(items);
    const orderIds = await insertOrders(user, seperatedOrders, address, charge);
    const purchase = await insertPurchase(user, orderIds, address, charge);
    console.log(purchase);
    return purchase;
  } catch (err) {
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
      { $set: { shipped: true } },
      { new: true }
    );
    return order;
  } catch (err) {
    throw Error('Could not mark order as fulfilled');
  }
};
