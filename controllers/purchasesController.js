const db = null;
const { retrievePurchase } = require('../services/purchasesService');

exports.createPurchase = async (req, res) => {};

exports.getPurchases = async (req, res) => {
  try {
    const { id } = req.user;

    const purchases = await db('purchases')
      .where({ purchases_buyer: id })
      .returning('*')
      .orderBy('purchases_created', 'desc');

    if (!purchases) {
      return res.status(400).json({
        success: false
      });
    }

    if (purchases.length) {
      for (let i = 0; i < purchases.length; i++) {
        for (let key in purchases[i].purchases_items) {
          const orderStatus = await (
            await db('orders')
              .where({
                order_uid: purchases[i].purchases_items[key]['orderId']
              })
              .returning('*')
          )[0]['order_status'];
          purchases[i].purchases_items[key]['orderStatus'] = orderStatus;
        }
        delete purchases[i].id;
        delete purchases[i].purchases_stripe;
        delete purchases[i].purchases_buyer;
      }
    }

    res.json({
      success: true,
      purchases
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getPurchase = async (req, res) => {
  try {
    const user = req.user;
    const { purchaseId } = req.params;

    const purchase = await retrievePurchase(user, purchaseId);

    res.json({
      success: true,
      purchase
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: [{ msg: err.message }]
    });
  }
};
