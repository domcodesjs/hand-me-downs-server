const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const db = require('../knex/knex');

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = (
      await db('users')
        .insert({
          user_email: email.trim().toLowerCase(),
          user_username: username.trim().toLowerCase(),
          user_password: hashedPassword
        })
        .returning(['id', 'user_email', 'user_username', 'user_role'])
    )[0];

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
      message: 'Server error: Failed to create user.'
    });
  }
};
