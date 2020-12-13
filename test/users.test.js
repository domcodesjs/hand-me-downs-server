const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const { createTables, dropTables } = require('./testHelpers');

describe('/users', () => {
  it('@POST /users should create a user', async () => {
    await dropTables();
    await createTables();
    return request(app)
      .post('/users')
      .send({
        email: 'dom@example.com',
        username: 'dom',
        password: '123456'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.keys('success', 'user', 'token');
      });
  });
});
