const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend for handmedowns'
  });
});

module.exports = router;
