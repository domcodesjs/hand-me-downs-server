const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const { createTables, dropTables } = require('./testHelpers');

describe('/categories', () => {
  it('@get /categories should get all categories', async () => {
    await dropTables();
    await createTables();
    const { body } = await request(app)
      .get('/categories')
      .set('Accept', 'application/json')
      .expect(200);
    return expect(body).to.have.keys('success', 'categories');
  });
});
