const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    yourName: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true
    },
    title: {
      type: String,
      minlength: 3,
      maxlength: 23,
      required: true
    },
    content: {
      type: String,
      minlength: 3,
      maxlength: 200,
      required: true
    },
    photo: {
      type: String
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'editDate'
    }
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
