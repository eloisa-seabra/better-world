const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const hbs = require('hbs');
const hbsDateHelper = require('helper-date');
const helperDate = require('helper-date');
const serveFavicon = require('serve-favicon');

const nodeSassMiddleware = require('node-sass-middleware');

const deserializeUser = require('./middleware/deserialize-user');
const bindUserToResponseLocals = require('./middleware/bind-user-to-response-locals');

const baseRouter = require('./routes/base');
const postRouter = require('./routes/post');
const authenticationRouter = require('./routes/authentication');
const profileRouter = require('./routes/profile');

const mongoStore = connectMongo(expressSession);
const bodyParser = require('body-parser');
const app = express();

app.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')));

// Set options for app

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper('date', hbsDateHelper);

// Mount necessary middleware

app.use(
  nodeSassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    outputStyle: 'nested',
    force: true,
    sourceMap: false
  })
);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 24 * 60 * 60 * 1000
    },
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);
app.use(deserializeUser);
app.use(bindUserToResponseLocals);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route Handlers

app.use(baseRouter);
app.use('/post', postRouter);
app.use('/authentication', authenticationRouter);
app.use('/profile', profileRouter);

// If no route handler is matched above,
// this will run
app.use('*', (request, response, next) => {
  const error = new Error('Page not found.');
  next(error);
});

// If next(error) was called previously,
// this will run
app.use((error, request, response, next) => {
  console.log(error);
  response.render('error', { error });
});

module.exports = app;
