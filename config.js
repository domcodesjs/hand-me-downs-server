require('dotenv').config();

module.exports = {
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET
};
