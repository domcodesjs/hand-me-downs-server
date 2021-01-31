const multer = require('multer');
const jimp = require('jimp');
const db = null;
const { v4: uuid } = require('uuid');
const {
  insertListing,
  retrieveListing,
  checkIfListingExists,
  retrieveListings,
  retrieveShopListings,
  modifyListing,
  removeListing,
  retrieveUserListings
} = require('../services/listingsService');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(_, file, next) {
    const isImage = file.mimetype.startsWith('image/');
    if (isImage) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not allowed' }, false);
    }
  }
};

exports.upload = multer(multerOptions).single('image');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `${uuid()}.${extension}`;
  const image = await jimp.read(req.file.buffer);
  image.resize(800, 1000);
  image.write(`./public/uploads/images/${req.body.image}`);
  next();
};

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
      message: 'Server error could not get listing'
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
    const { id } = req.user;
    const listing = (
      await db('listings')
        .where({ listing_uid: listingId, listing_user: id })
        .select({
          title: 'listing_title',
          category: 'listing_category',
          gender: 'listing_gender',
          description: 'listing_description',
          image: 'listing_image',
          uid: 'listing_uid',
          sold: 'listing_sold',
          created: 'listing_created',
          slug: 'listing_slug',
          price: 'listing_price'
        })
    )[0];

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
