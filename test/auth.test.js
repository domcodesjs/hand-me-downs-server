const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const { createTables, dropTables, createUser } = require('./testHelpers');

describe('/auth', () => {
  it('/auth/login should log a user in', async () => {
    await dropTables();
    await createTables();
    const { email, password } = await createUser();
    const { body } = await request(app)
      .post('/auth/login')
      .send({ email, password })
      .set('Accept', 'application/json')
      .expect(200);
    return expect(body).to.have.keys('success', 'user', 'token');
  });

  it('/auth/verifyJWT verify a users token and send the user credentials back', async () => {
    await dropTables();
    await createTables();
    const { token } = await createUser();
    const { body } = await request(app)
      .get('/auth/verifyJWT')
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);
    return expect(body).to.have.keys('email', 'username', 'role');
  });
});
