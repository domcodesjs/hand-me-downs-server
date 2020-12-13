const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const {
  createTables,
  dropTables,
  createUser,
  createListing,
  createOrder,
  getOrders
} = require('./testHelpers');

describe('/orders', () => {
  it('@get /orders should return all orders that belongs to a user', async () => {
    await dropTables();
    await createTables();
    const { token } = await createUser();
    const { listing } = await createListing(token);

    await createOrder(token, listing);

    const { body } = await request(app)
      .get('/orders')
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);

    return expect(body).to.have.keys('success', 'orders');
  });

  it('@post /orders/:orderId/fulfill should set an order as shipped', async () => {
    await dropTables();
    await createTables();

    const { token } = await createUser();
    const { listing } = await createListing(token);
    await createOrder(token, listing);
    const { orders } = await getOrders(token);

    const { body } = await request(app)
      .post(`/orders/${orders[0].order_uid}/fulfill`)
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);

    return expect(body.order.order_status).to.eql('Shipped');
  });

  it('@get /orders/:orderId should return info on a single order', async () => {
    await dropTables();
    await createTables();

    const { token } = await createUser();
    const { listing } = await createListing(token);
    await createOrder(token, listing);

    const { orders } = await getOrders(token);
    const { body } = await request(app)
      .get(`/orders/${orders[0].order_uid}`)
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);
    return expect(body).to.have.keys('success', 'order');
  });

  it('@post /orders/charge should charge an order and create an order and purchase(s)', async () => {
    await dropTables();
    await createTables();
    const { token } = await createUser();
    const { listing } = await createListing(token);
    const payload = {
      items: [
        {
          id: listing.id,
          title: listing.listing_title,
          gender: listing.listing_gender,
          category: listing.category,
          description: listing.listing_description,
          image: listing.listing_image,
          slug: listing.listing_slug,
          uid: listing.listing_uid,
          price: listing.listing_price,
          created: listing.listing_created,
          sold: listing.listing_sold,
          user: listing.listing_user
        }
      ],
      paymentMethod: { id: 'pm_card_visa' },
      address: {
        fullName: 'Test User',
        addressOne: '123 1st Ave S',
        addressTwo: '',
        zipCode: '98101',
        city: 'Seattle',
        state: 'WA'
      }
    };

    const res = await request(app)
      .post(`/orders/charge`)
      .send(payload)
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
      .expect(200);
    return expect(res.body).to.have.keys('success', 'purchase');
  });
});
