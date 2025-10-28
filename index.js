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
const bodyParser = require("body-parser")

const { 
  BPReadingModel,
  respRateModel,
  heartRateModel,
  oxygenSaturationModel,
  weightModel,
  temperatureModel,
  medicationModel,
  bloodSugarModel,
  appointmentModel
} = require('./models/healthTracker_model.js'); // replace './models' with your actual file path if different


const DATABASE_URL =
  process.env.DATABASE_URL;

connectDB(DATABASE_URL);

const userModel = require("./models/user_model.js")
const feedbackModel = require("./models/feedback_model.js")
const contactModel = require("./models/contact_model.js")


const port = 3000

const initializePassport = require('./passport_config')
initializePassport(
  passport,
  async email => await userModel.findOne({ signupEmail: email }),
  async id => await userModel.findById(id)
);

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/user', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.signupName })
})

app.get("/", (req,res)=>{
res.render('home.ejs')
})

app.get("/home", (req,res)=>{
res.render('home.ejs')
})

app.get("/services", (req,res)=>{
  res.render('services.ejs')
  })

  
app.get("/contact", (req,res)=>{
  res.render('contact.ejs')
  })

  
app.get("/resources", (req,res)=>{
  res.render('resources.ejs')
  })

  
app.get("/team", (req,res)=>{
  res.render('team.ejs')
  })

  
app.get("/appointments", (req,res)=>{
  res.render('appointments.ejs')
  })


app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/login',
  failureFlash: true
}))


app.post("/feedback", async (req, res) => {
  try {
    const { feedback } = req.body;

    const newFeedback = new feedbackModel({ feedback });
    await newFeedback.save();

    console.log("Feedback saved to MongoDB");
    res.redirect("/")
  } catch (error) {
    console.error("Error saving feedback:", error);
  }
});

app.post("/contact", async (req, res) => {
  try {
    const newContact = new contactModel({ 
      name: req.body.name
      , email: req.body.email
      , phone: req.body.phone
      , service: req.body.service
      , message: req.body.message
     });
    await newContact.save();
    console.log("Contact saved to MongoDB");
    res.redirect("/")
  } catch (error) {
    console.error("Error saving contact:", error);
  }
});

app.post("/vitals", checkAuthenticated,async (req, res) => {
  try {
    const fullBP = `${req.body.bloodPressure}`
    const respRate = req.body.respRate
    const heartRate = req.body.heartRate
    const oxygenSaturation = req.body.oxygenSaturation
    const temperature = req.body.temperature
    const weight = req.body.weight

    if (fullBP) {
      const [systolic,diastolic] = fullBP.split("/")
    const newBP = new BPReadingModel({
      user: req.user._id,
       systolic: parseInt(systolic),
  diastolic: parseInt(diastolic),
  date: Date.now()
    });
    await newBP.save();
    console.log("BP saved to MongoDB");
    }

       if (respRate) {
    const newRespRate = new respRateModel({
      user: req.user._id,
       respRate: parseInt(respRate),
  date: Date.now()
    });
    await newRespRate.save();
    console.log("Resp Rate saved to MongoDB");
    }
    

       if (temperature) {
    const newTemperature = new temperatureModel({
      user: req.user._id,
       temperature: parseFloat(temperature),
  date: Date.now()
    });
    await newTemperature.save();
    console.log("Temperature saved to MongoDB");
    }

    
       if (heartRate) {
    const newHeartRate = new heartRateModel({
      user: req.user._id,
       heartRate: parseInt(heartRate),
  date: Date.now()
    });
    await newHeartRate.save();
    console.log("Heart Rate saved to MongoDB");
    }

  if (oxygenSaturation) {
    const newOxygenSaturation = new oxygenSaturationModel({
      user: req.user._id,
       oxygenSaturation: parseInt(oxygenSaturation),
  date: Date.now()
    });
    await newOxygenSaturation.save();
    console.log("Oxygen Sat saved to MongoDB");
    }

         if (weight) {
    const newWeight = new weightModel({
      user: req.user._id,
       weight: parseInt(weight),
  date: Date.now()
    });
    await newWeight.save();
    console.log("Weight saved to MongoDB");
    }

    res.redirect("/user")
  } catch (error) {
    console.error("Error saving vital:", error);
  }
});


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
    return res.redirect('/user')
  }
  next()
}

app.listen(port, ()=> console.log(`app is listening at http://localhost:${port}`))