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
  describe('@GET listings', () => {
    it('Should return an array of objects if there are listings', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      await createListing(token);
      const res = await request(app)
        .get('/listings')
        .set('Accept', 'application/json')
        .expect(200);
      return expect(res.body.listings).to.have.lengthOf(1);
    });

    it('Should return an empty array if there are no listings', async () => {
      await dropTables();
      await createTables();
      return request(app)
        .get('/listings')
        .set('Accept', 'application/json')
        .expect(200)
        .then((res) => {
          expect(res.body.listings).to.eql([]);
        });
    });
  });

  describe('@PATCH listings', () => {
    it('Should update a single listing', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      const { listing } = await createListing(token);
      const res = await request(app)
        .patch(`/listings/${listing.listing_uid}`)
        .field('title', 'my awesome updated title')
        .field('description', 'my awesome updated description')
        .field('gender', 'women')
        .field('category', 'T-Shirts')
        .field('price', 20)
        .attach('image', './test/placeholder.png')
        .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
        .expect(200);
      return expect(res.body).to.have.keys('success', 'listing');
    });
  });

  describe('Get listings by ID', () => {
    it('@GET listings by ID should return the listing if it exists', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      const { listing } = await createListing(token);
      const res = await request(app)
        .get(`/listings/${listing.listing_uid}`)
        .set('Accept', 'application/json')
        .expect(200);
      return expect(res.body).to.have.keys('success', 'listing');
    });

    it('@GET listing by ID should return bad request if the listing does not exist', async () => {
      const res = await request(app)
        .get('/listings/paoskjf923ngm')
        .set('Accept', 'application/json')
        .expect(400);
      return expect(res.body).to.eql({
        success: false,
        message: 'That listing does not exist'
      });
    });
  });

  describe('Get shop listings', () => {
    it('@GET shop listings should return all listings of a shop', async () => {
      await dropTables();
      await createTables();
      const { token, username } = await createUser();
      await createListing(token);
      await createListing(token);
      await createListing(token);
      const res = await request(app)
        .get(`/listings/shop/${username}`)
        .set('Accept', 'application/json')
        .expect(200);
      return expect(
        res.body.listings.map((listing) => listing.username)
      ).to.include(username);
    });
  });

  describe('Delete listing', () => {
    it('Should delete a listing', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      const { listing } = await createListing(token);
      const res = await request(app)
        .delete(`/listings/${listing.listing_uid}`)
        .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
        .expect(200);
      return expect(res.body).to.include({
        success: true,
        message: 'Succesfully deleted listing'
      });
    });

    it('Should return bad request if trying to delete a listing that does not exist', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      const res = await request(app)
        .delete(`/listings/apsggsdfgdfj-02-d`)
        .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
        .expect(400);
      return expect(res.body).to.include({
        success: false,
        message: 'Failed to delete listing'
      });
    });
  });

  describe('listings/user/self', () => {
    it('should get a users own listings', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      await createListing(token);
      await createListing(token);
      await createListing(token);
      const res = await request(app)
        .get(`/listings/user/self`)
        .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
        .expect(200);
      return expect(res.body.listings).to.have.lengthOf(3);
    });
  });

  describe('listings/user/update', () => {
    it('/listings/user/update/:id should get a listing that will be updated', async () => {
      await dropTables();
      await createTables();
      const { token } = await createUser();
      const { listing } = await createListing(token);
      const res = await request(app)
        .get(`/listings/user/update/${listing.listing_uid}`)
        .set({ Authorization: `Bearer ${token}`, Accept: 'application/json' })
        .expect(200);
      return expect(res.body).to.have.keys('success', 'listing');
    });
  });
});
