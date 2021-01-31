const {
  insertListing,
  retrieveListing,
  checkIfListingExists,
  retrieveListings,
  retrieveShopListings,
  modifyListing,
  removeListing,
  retrieveUserListings,
  retrieveUserUpdatedListing
} = require('../services/listingsService');

exports.getLatestListings = async (req, res) => {
  try {
    const listings = await retrieveListings();

    if (!listings) {
      return res.status(400).json({
        success: false,
        message: 'That listing does not exist'
      });
    }

    res.json({
      success: true,
      listings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.createListing = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, price, image, category, gender } = req.body;
    const listing = await insertListing(user, {
      title,
      category,
      gender: gender.toLowerCase(),
      description,
      price,
      image
    });

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.listingExists = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await checkIfListingExists(listingId);

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.getListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await retrieveListing(listingId);

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.getUserUpdatedListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const user = req.user;
    const listing = await retrieveUserUpdatedListing(user, listingId);

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.getUserListings = async (req, res) => {
  try {
    const user = req.user;
    const listings = await retrieveUserListings(user);

    res.json({
      success: true,
      listings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const user = req.user;
    const deletedListing = await removeListing(user, listingId);

    res.json({
      success: true,
      message: 'Succesfully deleted listing',
      listing: {
        id: deletedListing._id
      }
    });
  } catch (err) {
    res.status(400).json({
      message: [{ msg: err.msg }]
    });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { title, description, category, gender, price, image } = req.body;
    const updatedListing = {
      title,
      description,
      gender,
      category,
      price
    };

    const { listingId } = req.params;
    const user = req.user;

    if (image && image !== 'undefined') {
      updatedListing['listing_image'] = req.body.image;
    }

    const listing = await modifyListing(user, listingId, updatedListing);

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.getShopListings = async (req, res) => {
  try {
    const { username } = req.params;
    const listings = await retrieveShopListings(username, res);

    res.json({
      success: true,
      listings
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      errors: [{ msg: err.message }]
    });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { title, category, gender } = req.query;
    let listings = await retrieveListings();

    let filteredListings = listings;

    if (title && title.trim('').length) {
      const results = filteredListings.filter((listing) =>
        listing.title.toLowerCase().includes(title.toLowerCase())
      );
      filteredListings = results;
    }

    if (gender && gender.trim('').length) {
      const results = filteredListings.filter(
        (listing) => listing.gender.toLowerCase() === gender.toLowerCase()
      );
      filteredListings = results;
    }

    if (category && category.trim('').length) {
      const results = filteredListings.filter(
        (listing) => listing.category.toLowerCase() === category.toLowerCase()
      );
      filteredListings = results;
    }

    res.json({
      success: true,
      listings: filteredListings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: [{ msg: err.message }]
    });
  }
};
