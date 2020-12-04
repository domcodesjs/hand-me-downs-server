const shortid = require('shortid');
const slugify = require('slugify');
const multer = require('multer');
const jimp = require('jimp');
const db = require('../knex/knex');
const { v4: uuid } = require('uuid');

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
  image.resize(800, jimp.AUTO);
  image.write(`./public/uploads/images/${req.body.image}`);
  next();
};

exports.getLatestListings = async (req, res) => {
  try {
    const listings = await db('listings')
      .join('users', { 'users.id': 'listings.listing_user' })
      .select({
        title: 'listing_title',
        category: 'listing_category',
        description: 'listing_description',
        image: 'listing_image',
        uid: 'listing_uid',
        sold: 'listing_sold',
        created: 'listing_created',
        slug: 'listing_slug',
        price: 'listing_price',
        sellerUsername: 'user_username'
      })
      .limit(6);

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
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Server error could not get listing'
    });
  }
};

exports.createListing = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, description, price, image, category, gender } = req.body;
    const listing = (
      await db('listings')
        .insert({
          listing_title: title,
          listing_category: category,
          listing_gender: gender.toLowerCase(),
          listing_description: description,
          listing_price: price,
          listing_image: image,
          listing_slug: await slugify(title, { lower: true }),
          listing_uid: shortid.generate(),
          listing_user: id
        })
        .returning('*')
    )[0];

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
    console.log(err);
    res.status(500).json(err);
  }
};

exports.listingExists = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = (
      await db('listings')
        .where({ listing_uid: listingId })
        .select('listing_uid', 'listing_slug')
    )[0];

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: 'That listing does not exist'
      });
    }

    res.json({
      success: true,
      listing: {
        uid: listing.listing_uid,
        slug: listing.listing_slug
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Server error could not get listing'
    });
  }
};

exports.getListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = (
      await db('listings')
        .where({ listing_uid: listingId })
        .join('users', { 'users.id': 'listings.listing_user' })
        .select({
          title: 'listing_title',
          category: 'listing_category',
          description: 'listing_description',
          image: 'listing_image',
          uid: 'listing_uid',
          sold: 'listing_sold',
          created: 'listing_created',
          slug: 'listing_slug',
          price: 'listing_price',
          sellerUsername: 'user_username'
        })
    )[0];

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
    console.log(err);
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
    const listings = await db('listings').where({ listing_user: id }).select({
      title: 'listing_title',
      price: 'listing_price',
      created: 'listing_created',
      image: 'listing_image',
      slug: 'listing_slug',
      uid: 'listing_uid',
      sold: 'listing_sold',
      username: 'listing_user'
    });

    if (!listings) {
      return res
        .status(400)
        .json({ success: false, message: 'Could not get user listings' });
    }

    res.json({
      success: true,
      listings
    });
  } catch (err) {
    console.log(err);
  }
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
    console.log(err);
    res.status(400).json({
      message: 'Failed to delete listing'
    });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { title, description, category, gender, price, image } = req.body;
    const updatedListing = {
      listing_title: title,
      listing_description: description,
      listing_gender: gender,
      listing_category: category,
      listing_price: price
    };
    const { listingId } = req.params;
    const { id } = req.user;

    if (image && image !== 'undefined') {
      updatedListing['listing_image'] = req.body.image;
    }

    const listing = (
      await db('listings')
        .where({
          listing_user: id,
          listing_uid: listingId
        })
        .update(updatedListing)
        .returning('*')
    )[0];

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update listing'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getShopListings = async (req, res) => {
  try {
    const { username } = req.params;

    const user = (
      await db('users').where({
        user_username: username.toLowerCase().trimEnd()
      })
    )[0];

    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: 'Shop does not exist'
      });
    }

    const listings = await db('listings')
      .join('users', {
        'users.id': 'listings.listing_user'
      })
      .where({
        listing_sold: false,
        'users.user_username': username.toLowerCase().trimEnd()
      })
      .select({
        title: 'listing_title',
        category: 'listing_category',
        description: 'listing_description',
        image: 'listing_image',
        slug: 'listing_slug',
        uid: 'listing_uid',
        price: 'listing_price',
        createdAt: 'listing_created',
        sold: 'listing_sold',
        username: 'user_username'
      });

    res.json({
      success: true,
      listings
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      message: 'Could not load shop'
    });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { title, category, gender } = req.query;
    let listings = await db('listings').where({ listing_sold: false }).select({
      title: 'listing_title',
      category: 'listing_category',
      gender: 'listing_gender',
      slug: 'listing_slug',
      uid: 'listing_uid',
      price: 'listing_price',
      sold: 'listing_sold'
    });

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
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
