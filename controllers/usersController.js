const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SMTP_SENDER } = require('../config');
const db = require('../knex/knex');
const transporter = require('../config/transporter');

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

    const welcomeEmail = await transporter.sendMail({
      from: `"Hand Me Downs" <${SMTP_SENDER}>`,
      to: 'dfaulring@gmail.com', // change this out
      subject: 'Welcome to Hand Me Downs!',
      text: 'Account created successfully!',
      html: '<p>Account created successfully!</p>'
    });

    console.log(welcomeEmail);

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
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to create user.'
    });
  }
};

exports.getUser = () => {};
