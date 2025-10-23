 require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require("mongoose")
const {connectDB} = require("./db/connectDB.js");
const path = require('path');

const DATABASE_URL =
  process.env.DATABASE_URL;

connectDB(DATABASE_URL);

const userModel = require("./models/user_model.js")


const port = 3000
const users = []

const initializePassport = require('./passport_config')
initializePassport(
  passport,
  async email => await userModel.findOne({ signupEmail: email }),
  async id => await userModel.findById(id)
);

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.signupName })
})

app.get("/home", (req,res)=>{
res.render('home.ejs')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup.ejs')
})

app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ signupEmail: req.body.signupEmail });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/signup');
    }

    const newUser = new userModel({
      signupName: req.body.signupName,
      signupEmail: req.body.signupEmail,
      signupPassword: req.body.signupPassword
    });

    await newUser.save();
    console.log('User saved to MongoDB');

    res.redirect('/login');
  } catch (err) {
    console.error('Error signing up user:', err);
    res.redirect('/signup');
  }
});


app.delete('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(port, ()=> console.log(`app is listening at http://localhost:${port}`))