const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.insertCategory = async (name) => {
  try {
    const category = new Category({ name });
    await category.save();

    return category;
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      throw Error('That category already exists');
    }
    throw Error('Could not create category');
  }
};

exports.retrieveCategories = async () => {
  try {
    const categories = await Category.find();

    return categories;
  } catch (err) {
    throw Error('Could not get categories');
  }
};

exports.removeCategory = async (categoryId) => {
  try {
    const category = await Category.findOneAndDelete({ _id: categoryId });

    return category;
  } catch (err) {
    throw Error('Could not delete category');
  }
};

exports.modifyCategory = async (categoryId, name) => {
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: { name }
      },
      { runValidators: true, new: true }
    );

    return category;
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      throw Error('That category already exists');
    }
    throw Error('Could not update category');
  }
};
