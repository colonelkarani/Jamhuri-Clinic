 require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const methodOverride = require('method-override')
const mongoose = require("mongoose")
const {connectDB} = require("./db/connectDB.js");
const path = require('path');
const nodemailer = require("nodemailer")
const crypto = require("crypto")

const { 
  BPReadingModel,
  heartRateModel,
  weightModel,
  medicationModel,
  bloodSugarModel,
  appointmentModel
} = require('./models/healthTracker_model.js'); // replace './models' with your actual file path if different


const DATABASE_URL =
  process.env.DATABASE_URL;

const GOOGLE_EMAIL = process.env.GOOGLE_EMAIL
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET


connectDB(DATABASE_URL);

const userModel = require("./models/user_model.js")
const feedbackModel = require("./models/feedback_model.js")
const contactModel = require("./models/contact_model.js")
const appointmentMdl = require("./models/appointment_model.js")


const port = 3000

const initializePassport = require('./passport_config')
// const { name } = require('ejs')
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

app.get('/user', checkAuthenticated, async (req, res) => {
    const userID = req.user._id

  try {
    const userAppointments = await appointmentModel.find({user: req.user._id})
    const userMedications = await medicationModel.find({user: req.user._id})
    res.render('index.ejs', { name: req.user.signupName, id:req.user._id,appointments: userAppointments, medications: userMedications, email: req.user.signupEmail })
  } catch (error) {
    console.error("Error fetching data", error)
  }
})

//Vitals api
app.get('/api/vitals-history/:userID', async (req, res) => {
  const userID = req.params.userID;
  try {
    const heartRates = await heartRateModel.find({ user: userID }).sort({ date: 1 });
    const bloodSugars = await bloodSugarModel.find({ user: userID }).sort({ date: 1 });
    const bloodPressures = await BPReadingModel.find({ user: userID }).sort({ date: 1 });
    const weights = await weightModel.find({ user: userID }).sort({ date: 1 });

    const vitals = heartRates.map((hr, i) => ({
      ts: hr.date.getTime(),
      heart: hr.heartRate,
      sugar: bloodSugars[i]?.bloodSugar,
      sys: bloodPressures[i]?.systolic,
      dia: bloodPressures[i]?.diastolic,
      weight: weights[i]?.weight,
    }));
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vitals api
// Assuming you have imported Vital model
app.delete('/api/vitals/:ts', async (req, res) => {
  const ts = Number(req.params.ts);
  if (!ts) return res.status(400).send('Invalid timestamp');

  const date = new Date(ts);

// Assuming these models represent different collections with possibly the same date field
const models = [bloodSugarModel, BPReadingModel, heartRateModel, weightModel]; // replace with your actual model names

try {
  // Run deletes in parallel
  const deleteResults = await Promise.all(
    models.map(m => m.deleteMany({ date: date })) // or deleteOne if only one doc per schema
  );

  res.status(200).json({ message: 'Deleted from all schemas', results: deleteResults });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Error deleting vitals across schemas' });
}
});


// Appointments APi
app.get('/api/appointments/:userID', async (req, res) => {
  const userID = req.params.userID;
  try {
     const appointments = await appointmentModel.find({ user: userID }).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Appointments api
app.delete('/api/appointments/:id', async (req, res) => {
const id = req.params.id

try {
appointmentModel.findByIdAndDelete(id).then(()=>{console.log("deleted an appointment")})
  res.status(200).json({ message: 'Deleted an appointment' });
  
} catch (err) {
  console.error(err);
  console.log("error deleting appointments")
  res.status(500).json({ message: 'Error deleting appointments across schemas' });
}
});


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

app.get("/bpGraph", (req,res)=>{
  res.render('bpGraph.ejs')
  })

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', {message: undefined, status: undefined})
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

app.post("/meds", checkAuthenticated,async(req,res)=>{
  try {
    const newMedication = new medicationModel({
      user: req.user._id,
      name: req.body.medicationName,
      dosage: req.body.dosage,
      status: req.body.status
    })
    await newMedication.save()
    console.log("Medication saved to database")
    res.redirect("/user")
    
  } catch (error) {
    console.error("Error saving new medication: ", error)
  }
})

app.post("/user-appointments", checkAuthenticated,async(req,res)=>{
  try {
    console.log(req.body)
    const date = req.body.date; // e.g. "2025-11-04"
const time = req.body.time; 
  const dateTimeString = `${date}T${time}:00`; // Append seconds if needed

  // Create Date object from combined string
  const dateTime = new Date(dateTimeString);

    const newAppointment = new appointmentModel({
      user: req.user._id,
      name: req.user.signupName,
      title: req.body.title,
      drName: req.body.drName,
      notesOrLocation: req.body.notesOrLocation,
      date: dateTime
    })
    await newAppointment.save()
    console.log("Appointment saved to database")
    res.redirect("/user")
    
  } catch (error) {
    console.error("Error saving new appointment: ", error)
  }
})

app.post("/contact", async (req, res) => {
  let name;

  if(req.body.firstName && req.body.lastName){
     name = `${req.body.firstName} ${req.body.lastName}`
  } else{
     name = req.body.name
  }

  try {
    const newContact = new contactModel({ 
      name: name
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

app.post("/appointment", async (req, res) => {

  try {
    const newAppointment = new appointmentMdl({ 
      name: req.body.name
      , email: req.body.email
      , phone: req.body.phone
      , date: req.body.date
      , time: req.body.time
      , reason: req.body.reason
      , notes: req.body.notes
     });
    await newAppointment.save();
    console.log("Appointment saved to DB");
    res.redirect("/")
  } catch (error) {
    console.error("Error saving appointment:", error);
  }
});


app.post("/blood-sugar", checkAuthenticated,async (req,res)=>{
try {

  const bloodSugar = req.body.bloodSugar
  const measurementTime = req.body.measurementTime
  const date = req.body.date
  const notes = req.body.notes

  const newBloodSugar= new bloodSugarModel({
    user: req.user._id,
    bloodSugar: parseFloat(bloodSugar),
    measurementTime: measurementTime,
    notes: notes,
    date: date
  })
 
  await newBloodSugar.save()
  console.log("Blood sugar saved to database")

    res.redirect("/user")

} catch (error) {
  console.error("Error saving blood Sugar ", error)
}
})

app.post("/vitals", checkAuthenticated,async (req, res) => {
  try {
    const systolicBp = req.body.systolicBp
    const diastolicBp = req.body.diastolicBp
    const heartRate = req.body.heartRate
    const weight = req.body.weight
const date = req.body.date; // e.g. "2025-11-04"
const time = req.body.time; // e.g. "14:30"
  // Combine date and time into one string in ISO format
  const dateTimeString = `${date}T${time}:00`; // Append seconds if needed

  // Create Date object from combined string
  const dateTime = new Date(dateTimeString);

if (systolicBp && diastolicBp) {
  // Combine date and time into one string in ISO format


  const newBP = new BPReadingModel({
    user: req.user._id,
    systolic: systolicBp,
    diastolic: diastolicBp,
    date: dateTime
  });
 
  await newBP.save()
    console.log("BP saved to MongoDB");
    }


    
       if (heartRate) {
    const newHeartRate = new heartRateModel({
      user: req.user._id,
       heartRate: parseInt(heartRate),
  date: dateTime
    });
    await newHeartRate.save();
    console.log("Heart Rate saved to MongoDB");
    }


         if (weight) {
    const newWeight = new weightModel({
      user: req.user._id,
       weight: parseInt(weight),
  date: dateTime
    });
    await newWeight.save();
    console.log("Weight saved to MongoDB");
    }
console.log(req.body)

    res.redirect("/user")
  } catch (error) {
    console.error("Error saving vital:", error);
  }
});



// LOGIN ROUTES

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup.ejs', {message: undefined})
})

//Email Transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GOOGLE_EMAIL,
        pass:  GOOGLE_APP_PASSWORD
    }
});

//Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();


app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ signupEmail: req.body.signupEmail });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.render('signup.ejs', {message: "The email you entered is already registered", status: "error"});
    }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new userModel({
      signupName: req.body.signupName,
      signupEmail: req.body.signupEmail,
      signupPassword: req.body.signupPassword,
      otp: otp,
      otpExpiry: otpExpiry
    });

    await newUser.save();
     await transporter.sendMail({
            from: GOOGLE_EMAIL,
            to: req.body.signupEmail,
            subject: 'OTP Verification',
            text: `${otp} is your verification code for Jamhuri Afya Health Tracker.\n Please enter it within 10 minutes to verify your account.\n Thank you for choosing us`
        });


    console.log('User registered. Please verify OTP sent to email');

    res.render("verifyOtp.ejs", {message: undefined, email: req.body.signupEmail})
  } catch (err) {
    console.error('Error signing up user:', err);
    res.render('signup.ejs', {message: "Error Signing up user", status: "error"});
  }
});

// Verify OTP
app.post("/verifyOtp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ signupEmail: email });
        

        if (!user) return     res.render('signup.ejs', {message: "User not found", status: "error"});
;
        if (user.isVerified) return   res.render('signup.ejs', {message: "User already verified", status: "error"});
;
        if (user.otp !== otp|| user.otpExpiry < new Date()) {
          await userModel.deleteOne({signupEmail: email})
            return     res.render('signup.ejs', {message: " Wrong or Expired OTP", status: "error"});;
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return     res.render('login.ejs', {message: "OTP verified you can now log in", status: "success"});;
    } catch (error) {
         res.render('signup.ejs', {message: "Error verifying OTP", status: "error"});
         console.error("Error :", error)
    }})

app.delete('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

//Google Authentication
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login-failure' }),
//   async(req, res) => {
//     const newUser = new userModel({
//       signupName: req.user.displayName,
//       signupEmail: req.user.emails?.[0]?.value,
//       signupPassword: req.user.id
//     })
//     await newUser.save()
//     res.render('index.ejs', {name: req.user.displayName, medications: undefined}); // Successful login redirect
//   });

// app.get('/login-failure', (req, res) => res.send('Failed to authenticate.'));


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