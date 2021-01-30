require('dotenv').config();

module.exports = {
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  DB_URL: process.env.DB_URL,
  LOCAL_DB_URL: process.env.LOCAL_DB_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET
};
