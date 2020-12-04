const express = require('express');
const router = express.Router();
const db = require('../knex/knex');
const { body } = require('express-validator');
const { createUser } = require('../controllers/usersController');

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    // check if email exists
    body('email').custom(async (email) => {
      const userEmailExists = await db('users')
        .where({
          user_email: email.toLowerCase()
        })
        .first();
      if (userEmailExists) {
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
      const usernameExists = await db('users')
        .where({
          user_username: username.toLowerCase()
        })
        .first();

      if (usernameExists) {
        throw new Error('Username already in use');
      }
    }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  createUser
);

module.exports = router;
