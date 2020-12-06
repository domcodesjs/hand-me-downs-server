require('dotenv').config();
const express = require('express');
// const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(helmet());
// app.use(morgan('tiny'));

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
