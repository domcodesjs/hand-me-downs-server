const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  createOrders,
  chargeCard,
  getChargeAmount,
  getOrders,
  getOrder,
  fulfillOrder
} = require('../controllers/ordersController');
const { createPurchase } = require('../controllers/purchasesController');

router.get('/', passport.authenticate('jwt', { session: false }), getOrders);
router.get(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  getOrder
);
router.post(
  '/:orderId/fulfill',
  passport.authenticate('jwt', { session: false }),
  fulfillOrder
);
router.post(
  '/charge',
  passport.authenticate('jwt', { session: false }),
  getChargeAmount,
  chargeCard,
  createOrders,
  createPurchase
);

module.exports = router;
