const request = require('supertest');
const Postgrator = require('postgrator');
const postgratorConfig = require('../postgrator-config');
const app = require('../app');
const postgrator = new Postgrator(postgratorConfig);

exports.createListing = async (token) => {
  try {
    const res = await request(app)
      .post('/listings')
      .field('title', 'my awesome avatar')
      .field('description', 'my awesome avatar')
      .field('category', 'T-Shirts')
      .field('gender', 'Unisex')
      .field('price', 20)
      .attach('image', `${__dirname}placeholder.png`)
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' });
    console.log(res.body);
  } catch (err) {
    console.log(err);
  }
};

exports.createUser = async () => {
  try {
    const res = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        username: 'test',
        password: '123456'
      })
      .set('Accept', 'application/json');
    return {
      email: res.body.user.email,
      password: '123456',
      token: res.body.token
    };
  } catch (err) {
    console.log(err);
  }
};

exports.dropTables = async () => {
  try {
    return await postgrator.migrate('0');
  } catch (err) {
    console.log(err);
  }
};

exports.createTables = async () => {
  try {
    return await postgrator.migrate();
  } catch (err) {
    console.log(err);
  }
};
