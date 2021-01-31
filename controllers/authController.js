const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { retrieveUserByEmail } = require('../services/usersService');
const { JWT_SECRET } = require('../config');

exports.isAdmin = async (req, res) => {};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await retrieveUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    const passwordMatch = await user.validatePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        admin: user.admin
      },
      JWT_SECRET
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        admin: user.admin
      },
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: 'Server error: Failed to login user' }]
    });
  }
};
