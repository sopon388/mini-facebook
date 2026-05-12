const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // 🔥 REAL RELATION
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  text: {
    type: String,
    default: ''
  },

  image: {
    type: String,
    default: null
  },

  video: {
    type: String,
    default: null
  },

  profilePic: {
    type: String,
    default: null
  },

  likes: {
    type: Number,
    default: 0
  },

  comments: [
    {
      text: {
        type: String,
        required: true
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, {
  timestamps: true // 🔥 adds createdAt & updatedAt
});

module.exports = mongoose.model('Post', postSchema);