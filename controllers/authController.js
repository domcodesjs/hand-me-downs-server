const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../knex/knex');
const { JWT_SECRET } = require('../config');

exports.isAdmin = async (req, res) => {};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await db('users')
      .where({ user_email: email.toLowerCase() })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.user_password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.user_email,
        username: user.user_username,
        role: user.user_role
      },
      JWT_SECRET
    );

    res.json({
      success: true,
      user: {
        email: user.user_email,
        username: user.user_username,
        role: user.user_role
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
