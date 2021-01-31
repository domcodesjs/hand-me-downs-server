const multer = require('multer');
const jimp = require('jimp');
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
  image.resize(800, 1000);
  image.write(`./public/uploads/images/${req.body.image}`);
  next();
};
