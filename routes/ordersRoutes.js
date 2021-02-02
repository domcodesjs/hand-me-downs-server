const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  fulfillOrder
} = require('../controllers/ordersController');

router.get('/', passport.authenticate('jwt', { session: false }), getOrders);
router.get(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  getOrder
);
router.post('/', passport.authenticate('jwt', { session: false }), createOrder);
router.post(
  '/:orderId/fulfill',
  passport.authenticate('jwt', { session: false }),
  fulfillOrder
);

module.exports = router;
