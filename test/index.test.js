const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');

describe('/', () => {
  it('@get / should return json info indicating this is the backend', async () => {
    const { body } = await request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200);
    return expect(body).to.eql({
      success: true,
      message: 'Backend for hand me downs'
    });
  });
});
