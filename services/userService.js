const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.insertUser = async (email, username, password) => {
  try {
    const user = new User({ email, username, password });
    await user.save();
    return user;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveUserById = async (id) => {
  try {
    const user = new User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
  }
};
