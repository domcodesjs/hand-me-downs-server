const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const slugify = require('slugify');
const { retrieveUserByUsername } = require('./usersService');

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
    throw Error('Could not insert listing');
  }
};

exports.checkIfListingExists = async (listingId) => {
  try {
    const listing = await Listing.findById(listingId, 'id slug');
    return listing;
  } catch (err) {
    throw Error('Could not retrieve listing');
  }
};

exports.retrieveListings = async () => {
  try {
    const listings = await Listing.find({ sold: false }).sort('-created_at');
    return listings;
  } catch (err) {
    throw Error('Could not retrieve listings');
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
    throw Error('Could not retrieve listing');
  }
};

exports.retrieveShopListings = async (username) => {
  try {
    const user = await retrieveUserByUsername(username);
    const listings = await Listing.find({ user: user._id, sold: false }).sort(
      '-created_at'
    );
    return listings;
  } catch (err) {
    throw Error('Shop does not exist');
  }
};

exports.retrieveUserUpdatedListing = async (user, listingId) => {
  try {
    const listing = await Listing.findOne({ _id: listingId, user: user.id });
    return listing;
  } catch (err) {
    throw Error('Could not retrieve listing');
  }
};

exports.retrieveLatestListings = async () => {
  try {
    const listing = await Listing.find({ sold: false })
      .sort('-created_at')
      .limit(4);
    return listing;
  } catch (err) {
    throw Error('Could not retrieve listing');
  }
};

exports.retrieveUserListings = async (user) => {
  try {
    const listings = await Listing.find({ user: user.id }).sort('-created_at');
    return listings;
  } catch (err) {
    throw Error('Could not retrieve listings');
  }
};

exports.modifyListing = async (user, listingId, data) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: listingId, user: user.id },
      { $set: data },
      {
        new: true
      }
    );
    return listing;
  } catch (err) {
    throw Error('Could not update listing');
  }
};

exports.removeListing = async (user, listingId) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: listingId,
      user: user.id
    });
    return listing;
  } catch (err) {
    throw Error('Could not delete listing');
  }
};
