const { model, Schema } = require('mongoose');

const userScrema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model('User', userScrema);
