const mongoose = require('mongoose');
const User = mongoose.model('User');
const Listing = mongoose.model('Listing');
const slugify = require('slugify');
const { retrieveUserByUsername } = require('./userService');

exports.insertListing = async (user, data) => {
  try {
    const listing = new Listing({
      ...data,
      slug: await slugify(data.title, { lower: true }),
      user: user.id
    });
    await listing.save();

    return listing;
  } catch (err) {
    console.log(err);
  }
};

exports.checkIfListingExists = async (listingId) => {
  try {
    const listing = await Listing.findById(listingId, 'id slug');
    console.log(listing);
    return listing;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveListings = async () => {
  try {
    const listings = await Listing.find();
    return listings;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveListing = async (listingId) => {
  try {
    const listing = await Listing.findById(listingId).populate(
      'user',
      'username'
    );
    return listing;
  } catch (err) {
    console.log(err);
  }
};

exports.retrieveShopListings = async (username) => {
  try {
    const user = await retrieveUserByUsername(username);
    const listings = await Listing.find({ user: user._id });

    return listings;
  } catch (err) {
    throw Error('Shop does not exist');
  }
};

exports.modifyListing = async (user, listingId, data) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: listingId, user: user.id },
      { $set: data }
    );
    return listing;
  } catch (err) {
    throw Error('Could not update listing');
  }
};
