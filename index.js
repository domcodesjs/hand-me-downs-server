const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config');
const app = require('./app');
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
})();

app.listen(PORT, () => console.log(`Express is running on port ${PORT}!`));
