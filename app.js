require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const { DB_URL } = require('./config');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};
connectToDatabase();
require('./models/User');
require('./models/Listing');
require('./models/Category');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
  })
);
app.use(helmet());
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/', require('./routes/index'));
app.use('/orders', require('./routes/ordersRoutes'));
app.use('/users', require('./routes/usersRoutes'));
app.use('/listings', require('./routes/listingsRoutes'));
app.use('/categories', require('./routes/categoriesRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/purchases', require('./routes/purchasesRoutes'));

module.exports = app;
