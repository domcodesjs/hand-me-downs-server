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
  modifyListing
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

    if (!listing) {
      return res.status(400).json({
        message: 'Could not create listing'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.listingExists = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await checkIfListingExists(listingId);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: 'That listing does not exist'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error could not get listing'
    });
  }
};

exports.getListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await retrieveListing(listingId);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: 'That listing does not exist'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error could not get listing'
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

    if (!listing) {
      return res.status(400).json({
        success: false,
        message:
          'Listing does not exist or you do not have permission to edit this listing'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error could not get listing'
    });
  }
};

exports.getUserListings = async (req, res) => {
  try {
    const { id } = req.user;
    const listings = await db('listings')
      .where({ listing_user: id })
      .select({
        title: 'listing_title',
        price: 'listing_price',
        created: 'listing_created',
        image: 'listing_image',
        slug: 'listing_slug',
        uid: 'listing_uid',
        sold: 'listing_sold',
        username: 'listing_user'
      })
      .orderBy('listing_created', 'desc');

    if (!listings) {
      return res
        .status(400)
        .json({ success: false, message: 'Could not get user listings' });
    }

    res.json({
      success: true,
      listings
    });
  } catch (err) {}
};

exports.deleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { id } = req.user;
    const deletedListing = (
      await db('listings')
        .where({ listing_user: id, listing_uid: listingId })
        .delete()
        .returning('listing_uid')
    )[0];

    if (!deletedListing) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete listing'
      });
    }

    res.json({
      success: true,
      message: 'Succesfully deleted listing',
      uid: deletedListing
    });
  } catch (err) {
    res.status(400).json({
      message: 'Failed to delete listing'
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

    if (!listings) {
      return res
        .status(400)
        .json({ success: false, message: 'Could not get listings' });
    }

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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
