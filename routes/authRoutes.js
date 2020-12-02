const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body } = require('express-validator');
const { login } = require('../controllers/authController');

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  login
);

router.get(
  '/verifyJWT',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { email, username, role } = req.user;
    res.json({ email, username, role });
  }
);

// works! checkIfAuthenticated
// passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     console.log(req.user);
//   };

module.exports = router;
