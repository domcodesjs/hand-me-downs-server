const db = null;
const { nanoid } = require('nanoid');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { orderId } = req.params;

    const order = (
      await db('orders')
        .where({ order_seller: id, order_uid: orderId })
        .returning('*')
    )[0];

    if (!order) {
      return res.status(400).json({
        success: false
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.fulfillOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { orderId } = req.params;

    const order = (
      await db('orders')
        .where({ order_seller: id, order_uid: orderId })
        .update({ order_status: 'Shipped' })
        .returning('*')
    )[0];

    if (!order) {
      return res.status(400).json({
        success: false
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { id } = req.user;

    const orders = await db('orders')
      .where({ order_seller: id })
      .returning('*')
      .orderBy('order_created', 'desc');

    if (!orders) {
      return res.status(400).json({
        success: false
      });
    }

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

const convertToCents = (amount) => {
  return Math.round(100 * parseFloat(amount.replace(/[$,]/g, '')));
};

exports.getChargeAmount = async (req, res, next) => {
  try {
    const itemIds = req.body.items.map((item) => item.uid);
    const total = (
      await db('listings').whereIn('listing_uid', itemIds).sum('listing_price')
    )[0];
    req.body.centsTotal = convertToCents(total.sum);
    req.body.itemIds = itemIds;
    next();
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.chargeCard = async (req, res, next) => {
  try {
    const { paymentMethod, centsTotal } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: centsTotal,
      currency: 'usd',
      payment_method: paymentMethod.id,
      metadata: {
        user: 1,
        orderId: 2
      },
      confirm: true
    });

    if (!paymentIntent) {
      return res.status(400).json({
        success: false,
        message: 'Could not charge card'
      });
    }

    delete req.body.paymentMethod;
    req.body.paymentIntent = paymentIntent;

    next();
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.createOrders = async (req, res, next) => {
  try {
    const { items, address, itemIds, paymentIntent, centsTotal } = req.body;
    const { id } = req.user;
    let sellers = {};

    for (let i = 0; i < items.length; i++) {
      if (!sellers.hasOwnProperty(items[i].sellerUsername)) {
        sellers[items[i].sellerUsername] = { items: [items[i]] };
      } else {
        sellers[items[i].sellerUsername]['items'].push(items[i]);
      }
    }

    await db('listings')
      .whereIn('listing_uid', itemIds)
      .update({ listing_sold: true })
      .returning('*');

    for (let key in sellers) {
      let orderId = nanoid(8);
      await db('orders').insert({
        order_total: calculateOrderTotal(sellers[key]['items']),
        order_items: sellers[key]['items'],
        order_uid: orderId,
        order_stripe: paymentIntent.id,
        order_buyer: id,
        order_seller: 1,
        order_shipping_address: address
      });
      sellers[key]['shippingAddress'] = address;
      sellers[key]['orderId'] = orderId;
    }

    for (let key in sellers) {
      let items = sellers[key]['items'];
      for (let i = 0; i < items.length; i++) {
        items[i]['sold'] = true;
      }
    }

    req.body.sellers = sellers;
    req.body.orderTotal = centsTotal / 100;
    next();
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

function calculateOrderTotal(items) {
  const total = items.reduce((a, c) => (a += parseFloat(c.price)), 0);
  return total;
}
