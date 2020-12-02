const nodemailer = require('nodemailer');
const {
  SMTP_SERVER,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD
} = require('../config');

module.exports = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
});
