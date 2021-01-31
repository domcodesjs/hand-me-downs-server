const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.insertUser = async (email, username, password) => {
  try {
    const user = new User({ email, username, password });
    await user.save();
    return user;
  } catch (err) {
    throw Error('Could not create account');
  }
};

exports.retrieveUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err) {
    throw Error('User does not exist');
  }
};

exports.retrieveUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw Error('User does not exist');
  }
};

exports.retrieveUserById = async (id) => {
  try {
    const user = new User.findById(id);
    return user;
  } catch (err) {
    throw Error('User does not exist');
  }
};
