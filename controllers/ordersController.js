const {
  insertOrder,
  retrieveOrders,
  retrieveOrder,
  markOrderAsFulfilled
} = require('../services/ordersService');

exports.createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { items, address, paymentMethod } = req.body;
    const purchase = await insertOrder(user, items, address, paymentMethod);

    res.status(200).json({
      success: true,
      purchase
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const order = await retrieveOrder(user, orderId);

    res.json({
      success: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.fulfillOrder = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const order = await markOrderAsFulfilled(user, orderId);

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
    const user = req.user;
    const orders = await retrieveOrders(user);

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};
