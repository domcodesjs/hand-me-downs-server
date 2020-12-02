const { nanoid } = require('nanoid');
const db = require('../knex/knex');

exports.createPurchase = async (req, res) => {
  try {
    const { id } = req.user;
    const { sellers, orderTotal, paymentIntent, address } = req.body;
    console.log(sellers, orderTotal, paymentIntent, address);

    const purchase = (
      await db('purchases')
        .insert({
          purchases_buyer: id,
          purchases_items: sellers,
          purchases_shipping_address: address,
          purchases_total: orderTotal,
          purchases_uid: nanoid(8),
          purchases_stripe: paymentIntent.id
        })
        .returning('*')
    )[0];

    if (!purchase) {
      return res.status(400).json({
        success: false,
        message: 'Could not create purchase'
      });
    }

    res.json({
      success: true,
      purchase: {
        items: purchase.purchases_items,
        shippingAddress: purchase.purchases_shipping_address,
        total: purchase.purchases_total,
        uid: purchase.purchases_uid
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getPurchases = async (req, res) => {
  try {
    const { id } = req.user;

    const purchases = await db('purchases')
      .where({ purchases_buyer: id })
      .returning('*');

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
    const { id } = req.user;
    const { purchaseId } = req.params;

    const purchase = (
      await db('purchases')
        .where({ purchases_buyer: id, purchases_uid: purchaseId })
        .returning('*')
    )[0];

    if (!purchase) {
      return res.status(400).json({
        success: false
      });
    }

    for (let key in purchase.purchases_items) {
      const orderStatus = await (
        await db('orders')
          .where({ order_uid: purchase.purchases_items[key]['orderId'] })
          .returning('*')
      )[0]['order_status'];
      purchase.purchases_items[key]['orderStatus'] = orderStatus;
    }

    delete purchase.id;
    delete purchase.purchases_stripe;
    delete purchase.purchases_buyer;

    res.json({
      success: true,
      purchase
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
