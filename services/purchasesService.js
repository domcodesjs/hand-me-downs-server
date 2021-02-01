const mongoose = require('mongoose');
const Purchase = mongoose.model('Purchase');

exports.insertPurchase = async (user, orderIds, address, charge) => {
  try {
    const purchase = new Purchase({
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

exports.retrievePurchase = async (user, purchaseId) => {
  try {
    const purchase = await Purchase.findOne({
      _id: purchaseId,
      buyer: user.id
    }).populate({
      path: 'orders',
      populate: [
        {
          path: 'items',
          model: 'Listing'
        },
        {
          path: 'seller',
          model: 'User'
        }
      ]
    });

    return purchase;
  } catch (err) {
    console.log(err);
    throw Error('Could not get purchase');
  }
};
