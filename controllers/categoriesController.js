const {
  retrieveCategories,
  insertCategory,
  modifyCategory,
  removeCategory
} = require('../services/categoriesService');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await insertCategory(name);

    res.json({
      success: true,
      category
    });
  } catch (err) {
    res.status(500).json({ success: false, errors: [{ msg: err.message }] });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const category = await modifyCategory(categoryId, name);

    res.json({
      success: true,
      category
    });
  } catch (err) {
    res.status(500).json({ success: false, errors: [{ msg: err.message }] });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await removeCategory(categoryId);

    res.json({
      success: true,
      category
    });
  } catch (err) {
    res.status(500).json({ success: false, errors: [{ msg: err.message }] });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await retrieveCategories();

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    res.status(500).json({ success: false, errors: [{ msg: err.message }] });
  }
};
