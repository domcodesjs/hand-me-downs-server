const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const {
  createTables,
  dropTables,
  createUser,
  createListing
} = require('./testHelpers');

describe('/listings', () => {
  describe('Get listings', () => {
    it('Should return an empty array if there are no listings', () => {
      return request(app)
        .get('/listings')
        .set('Accept', 'application/json')
        .expect(200)
        .then((res) => {
          expect(res.body.listings).to.eql([]);
        });
    });

    it('Should return an array of objects if there are listings in the table', () => {
      return request(app)
        .get('/listings')
        .set('Accept', 'application/json')
        .expect(200)
        .then((res) => {
          expect(res.body.listings).to.eql(['asdf']);
        });
    });
  });

  describe('Get listings by ID', () => {
    it('Should return the listing', () => {
      return request(app)
        .get('/listings/paoskjf923ngm')
        .set('Accept', 'application/json')
        .expect(400)
        .then((res) => {
          expect(res.body).to.eql({
            success: false,
            message: 'That listing does not exist'
          });
        });
    });

    it('Should return bad request if the listing does not exist', () => {
      return request(app)
        .get('/listings/paoskjf923ngm')
        .set('Accept', 'application/json')
        .expect(400)
        .then((res) => {
          expect(res.body).to.eql({
            success: false,
            message: 'That listing does not exist'
          });
        });
    });
  });
});

describe('/users', () => {
  it('Should create a user', async () => {
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
    await createListing(token);
    const { body } = await request(app)
      .get('/auth/verifyJWT')
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);
    return expect(body).to.have.keys('email', 'username', 'role');
  });
});
