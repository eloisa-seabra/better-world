const express = require('express');
const User = require('./../models/user');
const Post = require('./../models/post');

const routeAuthenticationGuard = require('./../middleware/route-authentication-guard');

const profileRouter = new express.Router();

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

profileRouter.get(
  '/edit',
  routeAuthenticationGuard,
  (request, response, next) => {
    response.render('profile/edit');
  }
);

profileRouter.post(
  '/edit',
  upload.single('profilePicture'),
  routeAuthenticationGuard,
  (request, response, next) => {
    const id = request.session.userId;
    const { name, email } = request.body;
    name.toUpperCase();
    const data = { name, email };

    if (request.file) {
      const profilePicture = request.file.path;
      data.profilePicture = profilePicture;
    }

    User.findByIdAndUpdate(id, data)
      .then(() => {
        response.redirect(`/profile/${id}`);
      })
      .catch(error => {
        next(error);
      });
  }
);

profileRouter.get(
  '/:id',
  routeAuthenticationGuard,
  (request, response, next) => {
    const id = request.params.id;

    let user;

    User.findById(id)
      .then(document => {
        user = document;
        return Post.find({ creator: id }).populate('creator');
      })
      .then(posts => {
        response.render('profile/display', { profile: user, posts });
      })
      .catch(error => {
        next(error);
      });
  }
);

module.exports = profileRouter;
