const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { insertUser } = require('../services/usersService');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, username, password } = req.body;
    const user = await insertUser(email, username, password);

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
        username: user.username
      },
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to create user.'
    });
  }
};
