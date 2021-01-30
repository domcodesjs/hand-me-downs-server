const db = null;

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
