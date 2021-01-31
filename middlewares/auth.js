exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user.admin) {
      throw Error('You must be an admin');
    }

    next();
  } catch (err) {
    res.status(500).json({
      sucess: false,
      errors: [{ msg: err.message }]
    });
  }
};
