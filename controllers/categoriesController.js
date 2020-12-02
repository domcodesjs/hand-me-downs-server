const { validationResult } = require('express-validator');
const db = require('../knex/knex');

exports.getCategories = async (req, res) => {
  try {
    const categories = await db('categories').select({ name: 'category_name' });

    if (!categories) {
      return res.status(400).json({
        success: false,
        message: 'Could not get categories'
      });
    }

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const categories = await db('categories').select('*');
    console.log(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categories = await db('categories').select('*');
    console.log(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
