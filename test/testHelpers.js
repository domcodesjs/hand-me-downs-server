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
      .attach('image', './test/placeholder.png')
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' });
    return res.body;
  } catch (err) {
    console.log(err);
  }
};

exports.getPurchases = async (token) => {
  try {
    const res = await request(app)
      .get('/purchases')
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' });
    return res.body;
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
      username: res.body.user.username,
      password: '123456',
      token: res.body.token
    };
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (token) => {
  try {
    const res = await request(app)
      .get(`/orders`)
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' });
    return res.body;
  } catch (err) {
    console.log(err);
  }
};

exports.createOrder = async (token, listing) => {
  try {
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
      .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' });

    return res.body;
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
