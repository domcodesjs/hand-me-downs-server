const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  getPurchases,
  getPurchase
} = require('../controllers/purchasesController');

router.get('/', passport.authenticate('jwt', { session: false }), getPurchases);
router.get(
  '/:purchaseId',
  passport.authenticate('jwt', { session: false }),
  getPurchase
);

module.exports = router;
