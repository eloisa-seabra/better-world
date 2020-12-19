const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  email: {
    type: String,
    required: true,
    minlength: 5
  },
  passwordHashAndSalt: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    required: [true, 'A profile picture is required.']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
