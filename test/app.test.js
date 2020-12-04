const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const db = require('../knex/knex');

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
  it('Should create a user', () => {
    return request(app)
      .post('/users')
      .send({ email: 'kana@example.com', username: 'kana', password: '123456' })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        console.log(res.body);
      });
  });
});
