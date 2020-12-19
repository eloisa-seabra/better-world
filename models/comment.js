const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: Number,
      minlength: 1,
      maxlength: 5,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    imagePath: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt'
    }
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
