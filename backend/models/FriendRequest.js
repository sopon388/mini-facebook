const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  from: String,
  to: String,
  status: String
});

module.exports = mongoose.model('FriendRequest', schema);
