const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register } = require('../controllers/usersController');
const {
  retrieveUserByEmail,
  retrieveUserByUsername
} = require('../services/usersService');

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    // check if email exists
    body('email').custom(async (email) => {
      const user = await retrieveUserByEmail(email);
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
    body('username').custom(async (username) => {
      const regex = /^(?=[a-zA-Z0-9._]{1,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      if (!username.trim().toLowerCase().match(regex)) {
        throw new Error(
          'Username must be between 3 and 20 characters and can only contain alphanumeric characters, underscore and dot'
        );
      }
    }),
    body('username').custom(async (username) => {
      const user = await retrieveUserByUsername(username);
      if (user) {
        throw new Error('Username already in use');
      }
    }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  register
);

module.exports = router;
