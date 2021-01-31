const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAdmin } = require('../middlewares/auth');
const {
  getCategories,
  deleteCategory,
  updateCategory,
  createCategory
} = require('../controllers/categoriesController');

router.get('/', getCategories);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  createCategory
);
router.patch(
  '/:categoryId',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  updateCategory
);
router.delete(
  '/:categoryId',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteCategory
);

module.exports = router;
