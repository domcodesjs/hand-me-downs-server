const {
  retrievePurchase,
  retrievePurchases
} = require('../services/purchasesService');

exports.createPurchase = async (req, res) => {};

exports.getPurchases = async (req, res) => {
  try {
    const user = req.user;

    const purchases = await retrievePurchases(user);

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
