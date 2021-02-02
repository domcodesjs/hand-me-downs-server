const mongoose = require('mongoose');
const Purchase = mongoose.model('Purchase');

exports.insertPurchase = async (user, orderIds, address, charge, total) => {
  try {
    const purchase = new Purchase({
      total,
      orders: orderIds,
      shipping_address: address,
      stripe_id: charge.id,
      buyer: user.id
    });
    await purchase.save();

    return purchase;
  } catch (err) {
    throw Error('Could not insert purchase');
  }
};

exports.retrievePurchases = async (user) => {
  try {
    const purchases = await Purchase.find({
      buyer: user.id
    })
      .sort('-created_at')
      .populate({
        path: 'orders',
        populate: {
          path: 'items',
          model: 'Listing'
        }
      });
    return purchases;
  } catch (err) {
    throw Error('Could not get purchases');
  }
};

exports.retrievePurchase = async (user, purchaseId) => {
  try {
    const purchase = await Purchase.findOne({
      _id: purchaseId,
      buyer: user.id
    }).populate({
      path: 'orders',
      populate: [
        {
          path: 'seller',
          model: 'User'
        },
        {
          path: 'items',
          model: 'Listing'
        }
      ]
    });
    return purchase;
  } catch (err) {
    throw Error('Could not get purchase');
  }
};
