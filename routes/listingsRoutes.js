const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const {
  createListing,
  upload,
  resize,
  getListing,
  listingExists,
  getShopListings,
  getLatestListings,
  deleteListing,
  getUserUpdatedListing,
  updateListing,
  getListings,
  getUserListings
} = require('../controllers/listingsController');

router.get('/', getListings);
router.get('/:listingId', getListing);
router.get(
  '/user/self',
  passport.authenticate('jwt', { session: false }),
  getUserListings
);
router.patch(
  '/:listingId',
  passport.authenticate('jwt', { session: false }),
  upload,
  async (req, res, next) => {
    req.body = await JSON.parse(JSON.stringify(req.body, null));
    next();
  },
  [
    body('title')
      .isLength({ min: 3 })
      .withMessage('Title length must be greater than 3'),
    body('description')
      .isLength({ min: 3 })
      .withMessage('Description length must be greater than 3'),
    body('category').isLength({ min: 3 }).withMessage('You supply a category'),
    body('gender').isLength({ min: 3 }).withMessage('You supply a gender'),
    body('price')
      .isFloat({ min: 1, max: 1000 })
      .withMessage(
        'You supply a price greater than $1 and less than or equal to $1000'
      )
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  resize,
  updateListing
);
router.get('/app/latest', getLatestListings);
router.get('/shop/:username', getShopListings);
router.get('/check/:listingId', listingExists);
router.delete(
  '/:listingId',
  passport.authenticate('jwt', { session: false }),
  deleteListing
);
router.get(
  '/user/update/:listingId',
  passport.authenticate('jwt', { session: false }),
  getUserUpdatedListing
);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload,
  async (req, res, next) => {
    req.body = await JSON.parse(JSON.stringify(req.body, null));
    next();
  },
  [
    body('title')
      .isLength({ min: 3 })
      .withMessage('Title length must be greater than 3'),
    body('description')
      .isLength({ min: 3 })
      .withMessage('Description length must be greater than 3'),
    body('category').isLength({ min: 3 }).withMessage('You supply a category'),
    body('gender').isLength({ min: 3 }).withMessage('You supply a gender'),
    body('price')
      .isFloat({ min: 1, max: 1000 })
      .withMessage(
        'You supply a price greater than $1 and less than or equal to $1000'
      )
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  resize,
  createListing
);

// passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     console.log(req.user);
//   };

module.exports = router;
