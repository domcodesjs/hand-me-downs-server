require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: 'https://handmedowns-client.herokuapp.com' }));
// app.use((req, res, next) => {
//   res.setHeader(
//     'Access-Control-Allow-Origin',
//     'https://handmedowns-client.herokuapp.com/'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, PATCH, DELETE'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With,content-type'
//   );
//   next();
// });
app.use(helmet());
app.use(morgan('tiny'));

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
