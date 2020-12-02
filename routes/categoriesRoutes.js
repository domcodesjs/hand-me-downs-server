const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoriesController');

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/categoryId', deleteCategory);

module.exports = router;
