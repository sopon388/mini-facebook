const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  surname: String,
  birthday: String,
  age: Number,
  gender: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);
