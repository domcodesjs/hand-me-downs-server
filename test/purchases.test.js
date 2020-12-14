const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const {
  createTables,
  dropTables,
  createUser,
  createListing,
  createOrder,
  getPurchases
} = require('./testHelpers');

describe('/purchases', () => {
  it('@get /purchases should return all purchases that belongs to a user', async () => {
    await dropTables();
    await createTables();
    const { token } = await createUser();
    const { listing } = await createListing(token);

    await createOrder(token, listing);

    const { body } = await request(app)
      .get('/purchases')
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);

    return expect(body).to.have.keys('success', 'purchases');
  });

  it('@get /purchases/:purchaseId should return a single purchase that belongs to a user', async () => {
    await dropTables();
    await createTables();
    const { token } = await createUser();
    const { listing } = await createListing(token);

    await createOrder(token, listing);
    const { purchases } = await getPurchases(token);

    const { body } = await request(app)
      .get(`/purchases/${purchases[0].purchases_uid}`)
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);

    return expect(body).to.have.keys('success', 'purchase');
  });
});
