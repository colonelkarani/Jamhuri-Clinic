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
const { connectDB } = require("./db/connectDB.js");
const path = require('path');
const { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, pages: seoPages } = require('./config/seo.js');
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const axios = require("axios")
const helmet = require('helmet')
//const rateLimit = require('express-rate-limit')

const {
  BPReadingModel,
  heartRateModel,
  weightModel,
  medicationModel,
  profileInfoModel,
  bloodSugarModel,
  appointmentModel
} = require('./models/healthTracker_model.js'); // replace './models' with your actual file path if different


const DATABASE_URL = process.env.DATABASE_URL;

const GOOGLE_EMAIL = process.env.GOOGLE_EMAIL
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

connectDB(DATABASE_URL);

const userModel = require("./models/user_model.js")
const feedbackModel = require("./models/feedback_model.js")
const contactModel = require("./models/contact_model.js")
const appointmentMdl = require("./models/appointment_model.js")

// FIX: read port from env so you can actually change it per-environment
const port = process.env.PORT || 3000

const initializePassport = require('./passport_config')
initializePassport(
  passport,
  async email => await userModel.findOne({ signupEmail: email }),
  async id => await userModel.findById(id)
);

app.set('view engine', 'ejs')

app.locals.siteUrl = SITE_URL
app.locals.siteName = SITE_NAME
app.locals.defaultOgImage = DEFAULT_OG_IMAGE

// FIX: trust the first proxy hop. Required in production behind Heroku/Render/nginx/etc,
// otherwise secure cookies (see session config below) silently never get set.
app.set('trust proxy', 1)

app.disable('x-powered-by')

// Add security headers while keeping the existing inline scripts and styles working.
app.use(helmet({ contentSecurityPolicy: false }))

// Keep all production URLs on the canonical HTTPS host to prevent duplicate content.
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next()

  const canonicalHost = new URL(SITE_URL).hostname
  if (req.hostname !== canonicalHost || req.protocol !== 'https') {
    return res.redirect(301, `${SITE_URL}${req.originalUrl}`)
  }

  next()
})

// FIX: basic security headers (X-Frame-Options, CSP defaults, etc.)
// CHANGED: helmet's default CSP blocks inline <script> tags, inline onclick=""
// attributes, and third-party script CDNs. Configuring it explicitly instead
// of using the (overly strict) defaults, since index.ejs relies on both.
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'", 
//           "'unsafe-inline'", 
//           "https://cdn.tailwindcss.com", 
//           "https://cdnjs.cloudflare.com"
//         ],
//         styleSrc: [
//           "'self'", 
//           "'unsafe-inline'", 
//           "https://cdnjs.cloudflare.com", 
//           "https://fonts.googleapis.com"
//         ],
//         fontSrc: [
//           "'self'", 
//           "https://gstatic.com",
//           "https://googleapis.com",
//           "data:"
//         ],
//         imgSrc: [
//           "'self'", 
//           "data:", 
//           "https://placehold.co"
//         ],
//       },
//     },
//   })
// );

app.get('/home', (req, res) => {
  res.redirect(301, '/')
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(flash())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // FIX: harden the session cookie for production
  cookie: {
    httpOnly: true,                                   // JS on the page can't read the cookie
    secure: process.env.NODE_ENV === 'production',     // only sent over HTTPS in prod
    sameSite: 'lax',                                   // basic CSRF mitigation for cookie
    maxAge: 24 * 60 * 60 * 1000                         // 1 day, adjust as you like
  }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

function wantsJson(req) {
  return req.get('Accept')?.includes('application/json')
}

function formResponse(req, res, { success, message, statusCode = 200 }) {
  if (wantsJson(req)) {
    return res.status(statusCode).json({ success, message })
  }
  if (success) return res.redirect('/')
  return res.status(statusCode).send(message)
}

// FIX: rate limit auth endpoints to slow down brute forcing of passwords / OTPs
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20,                  // 20 attempts per IP per window
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: 'Too many attempts, please try again later.' }
// })

// ---------------------------------------------------------------------------
// USER / PROFILE
// ---------------------------------------------------------------------------

app.get('/user', checkAuthenticated, async (req, res) => {
  try {
    const userAppointments = await appointmentModel.find({ user: req.user._id })
    const profileInfo = await profileInfoModel.find({ user: req.user._id })
    const { phone, height, bloodType, chronicConditions, allergies, primaryPhysician, physicianPhone, emergencyRelation, emergencyName, emergencyPhone } = profileInfo[0]
    res.render('index.ejs', {
      ...seoPages.user,
      name: req.user.signupName,
      id: req.user._id,
      appointments: userAppointments,
      email: req.user.signupEmail,
      height: profileInfo.height,
      bloodType, chronicConditions, allergies, phone, primaryPhysician, physicianPhone, emergencyRelation, emergencyName, emergencyPhone
    })
  } catch (error) {
    console.error("Error fetching data", error)
    res.status(500).send('Error loading profile')
  }
})

// FIX: whitelist of fields a user is allowed to update on their own profile.
// Prevents mass assignment (e.g. someone POSTing { user: '<someone_elses_id>', isAdmin: true }).
const ALLOWED_PROFILE_FIELDS = [
  'phone', 'height', 'bloodType', 'chronicConditions', 'allergies',
  'primaryPhysician', 'physicianPhone', 'emergencyRelation', 'emergencyName', 'emergencyPhone'
];

function pickAllowedFields(body, allowedFields) {
  const result = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      result[field] = body[field];
    }
  }
  return result;
}

// Updating profile
app.post('/update-profile', checkAuthenticated, async (req, res) => {
  const userId = req.user._id
  // FIX: only pull whitelisted fields off req.body instead of trusting the whole payload
  const updateData = pickAllowedFields(req.body, ALLOWED_PROFILE_FIELDS)
  try {
    await profileInfoModel.findOneAndUpdate({ user: userId }, updateData, { new: true })
    console.log("Profile updated")
    res.redirect('/user')
  } catch (err) {
    console.error("Error updating profile:", err)
    res.status(500).send('Error updating profile');
  }
});

// ---------------------------------------------------------------------------
// VITALS
// ---------------------------------------------------------------------------

// FIX: added checkAuthenticated, and now always reads the id from req.user._id
// instead of trusting a client-supplied :userID param. This closes the IDOR hole
// where anyone could read anyone else's health data by guessing/passing an id.
app.get('/api/vitals-history/:userID', checkAuthenticated, async (req, res) => {
  const userID = req.user._id;
  try {
    const heartRates = await heartRateModel.find({ user: userID }).sort({ date: 1 });
    const bloodSugars = await bloodSugarModel.find({ user: userID }).sort({ date: 1 });
    const bloodPressures = await BPReadingModel.find({ user: userID }).sort({ date: 1 });
    const weights = await weightModel.find({ user: userID }).sort({ date: 1 });

    // FIX: the old code zipped these four arrays together by INDEX, assuming
    // every collection had the same number of entries logged on the same days.
    // In practice a user might log a heart rate on Monday and blood sugar on
    // Tuesday, which silently mismatches readings against the wrong dates.
    // Instead, merge by actual date (rounded to the day) into one map.
    const vitalsByDate = new Map();

    const dayKey = (d) => new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD

    const upsert = (date, patch) => {
      const key = dayKey(date);
      const existing = vitalsByDate.get(key) || { ts: new Date(date).getTime() };
      vitalsByDate.set(key, { ...existing, ...patch });
    };

    heartRates.forEach(hr => upsert(hr.date, { heart: hr.heartRate }));
    bloodSugars.forEach(bs => upsert(bs.date, { sugar: bs.bloodSugar }));
    bloodPressures.forEach(bp => upsert(bp.date, { sys: bp.systolic, dia: bp.diastolic }));
    weights.forEach(w => upsert(w.date, { weight: w.weight }));

    const vitals = Array.from(vitalsByDate.values()).sort((a, b) => a.ts - b.ts);

    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FIX: now requires auth, and deletes are scoped to req.user._id so you can
// only delete your own entries, and only the specific record matching the
// timestamp for that user (rather than deleteMany with no user filter, which
// used to be able to wipe out other users' records sharing that exact timestamp).
app.delete('/api/vitals/:ts', checkAuthenticated, async (req, res) => {
  const ts = Number(req.params.ts);
  if (!ts) return res.status(400).send('Invalid timestamp');

  const date = new Date(ts);
  const userID = req.user._id;

  const models = [bloodSugarModel, BPReadingModel, heartRateModel, weightModel];

  try {
    const deleteResults = await Promise.all(
      models.map(m => m.deleteMany({ date: date, user: userID }))
    );
    res.status(200).json({ message: 'Deleted from all schemas', results: deleteResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting vitals across schemas' });
  }
});

app.post("/blood-sugar", checkAuthenticated, async (req, res) => {
  try {
    const bloodSugar = req.body.bloodSugar
    const notes = req.body.notes
    const date = req.body.date
    const time = req.body.time
    const dateTimeString = `${date}T${time}:00`
    const dateTime = new Date(dateTimeString);

    const newBloodSugar = new bloodSugarModel({
      user: req.user._id,
      bloodSugar: parseFloat(bloodSugar),
      notes: notes,
      date: dateTime
    })

    await newBloodSugar.save()
    console.log("Blood sugar saved to database")
    res.redirect("/user")
  } catch (error) {
    console.error("Error saving blood Sugar ", error)
    // FIX: previously this just logged and left the request hanging with no response.
    res.status(500).send('Error saving blood sugar reading')
  }
})

app.post("/vitals", checkAuthenticated, async (req, res) => {
  try {
    const systolicBp = req.body.systolicBp
    const diastolicBp = req.body.diastolicBp
    const heartRate = req.body.heartRate
    const weight = req.body.weight
    const date = req.body.date
    const time = req.body.time
    const dateTimeString = `${date}T${time}:00`
    const dateTime = new Date(dateTimeString);

    if (systolicBp && diastolicBp) {
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

    res.redirect("/user")
  } catch (error) {
    console.error("Error saving vital:", error);
    // FIX: send a response instead of leaving the client hanging on error
    res.status(500).send('Error saving vitals')
  }
});

// ---------------------------------------------------------------------------
// ACCOUNTS
// ---------------------------------------------------------------------------

// FIX: this used to have NO auth check at all — anyone could delete ANY account
// by guessing/enumerating Mongo IDs. Now requires login, and only allows a user
// to delete their OWN account (req.user._id), never an arbitrary :id.
// If you need an admin-delete-any-account feature, build it separately behind
// a proper role check (see /admin fix below) rather than reusing this route.
app.delete('/api/accounts/:id', checkAuthenticated, async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }
    const deletedUser = await userModel.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Account not found' });
    }
    req.logout(function (err) {
      if (err) console.error('Error logging out after account deletion:', err);
      res.status(200).json({ message: 'Deleted the Account' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting the account' });
  }
});

// ---------------------------------------------------------------------------
// APPOINTMENTS
// ---------------------------------------------------------------------------

// FIX: auth required, and scoped to the logged-in user instead of trusting :userID.
app.get('/api/appointments/:userID', checkAuthenticated, async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ user: req.user._id }).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FIX: auth required, and only deletes if the appointment belongs to the requester.
app.delete('/api/appointments/:id', checkAuthenticated, async (req, res) => {
  const id = req.params.id
  try {
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your appointment' });
    }
    await appointmentModel.findByIdAndDelete(id)
    console.log("deleted an appointment")
    res.status(200).json({ message: 'Deleted an appointment' });
  } catch (err) {
    console.error(err);
    console.log("error deleting appointments")
    res.status(500).json({ message: 'Error deleting appointments across schemas' });
  }
});

app.post("/user-appointments", checkAuthenticated, async (req, res) => {
  try {
    const date = req.body.date
    const time = req.body.time
    const dateTimeString = `${date}T${time}:00`
    const dateTime = new Date(dateTimeString);

    await transporter.sendMail({
      from: GOOGLE_EMAIL,
      to: GOOGLE_EMAIL,
      subject: 'New Appointment ',
      text: `Hello Victor. \n You have a new appointment "${req.body.title}" from ${req.user.signupName} on ${date} at ${time} \n Other notes ${req.body.notesOrLocation}`
    });

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
    // FIX: send a response instead of leaving the client hanging on error
    res.status(500).send('Error saving appointment')
  }
})

app.post("/appointment", async (req, res) => {
  try {
    const newAppointment = new appointmentMdl({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
      time: req.body.time,
      reason: req.body.reason,
      notes: req.body.notes
    });
    await newAppointment.save();
    console.log("Appointment saved to DB");

    // --- SEND WHATSAPP MESSAGE ---
    const waMessage = `📅 *New Public Appointment Request*\n\n*Name:* ${req.body.name}\n*Email:* ${req.body.email}\n*Phone:* ${req.body.phone}\n*Date:* ${req.body.date}\n*Time:* ${req.body.time}\n*Reason:* ${req.body.reason}\n*Notes:* ${req.body.notes || 'None'}`;
    await sendAdminWhatsApp(waMessage);
    formResponse(req, res, { success: true, message: 'Appointment request submitted successfully!' })
  } catch (error) {
    console.error("Error saving appointment:", error);
    formResponse(req, res, { success: false, message: 'Error saving appointment. Please try again.', statusCode: 500 })
  }
});

// ---------------------------------------------------------------------------
// MEDICATIONS
// ---------------------------------------------------------------------------

app.post("/meds", checkAuthenticated, async (req, res) => {
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
    res.status(500).send('Error saving medication')
  }
})

// ---------------------------------------------------------------------------
// STATIC / MARKETING PAGES
// ---------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.render('home.ejs', seoPages.home)
})

app.get("/services", (req, res) => {
  res.render('services.ejs', seoPages.services)
})

// FIX: /admin was completely unauthenticated before — anyone who found the URL
// got the admin page. This is a placeholder role check; replace `isAdmin` with
// whatever field your userModel actually uses to mark admins, and add that
// field to the schema if it doesn't exist yet.
function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next()
  }
  return res.status(403).send('Forbidden')
}

app.get("/admin", checkAuthenticated, checkAdmin, (req, res) => {
  res.render('admin.ejs', seoPages.admin)
})

app.get("/contact", (req, res) => {
  res.render('contact.ejs', seoPages.contact)
})

app.get("/resources", (req, res) => {
  res.render('resources.ejs', seoPages.resources)
})

app.get("/team", (req, res) => {
  res.render('team.ejs', seoPages.team)
})

app.get("/appointments", (req, res) => {
  res.render('appointments.ejs', seoPages.appointments)
})

app.get("/bpGraph", (req, res) => {
  res.render('bpGraph.ejs', seoPages.bpGraph)
})

// ---------------------------------------------------------------------------
// AUTH: LOGIN
// ---------------------------------------------------------------------------

app.get('/login', checkNotAuthenticated, (req, res) => {
  // CHANGED: read the flash message passport set on failed login instead of
  // always rendering undefined
  const errors = req.flash('error')
  res.render('login.ejs', {
    ...seoPages.login,
    message: errors.length ? errors[0] : undefined,
    status: errors.length ? 'error' : undefined
  })
})

// FIX: rate limited to slow down credential-stuffing / brute force attempts
// app.post('/login', authLimiter, checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/user',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

app.delete('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// ---------------------------------------------------------------------------
// AUTH: SIGNUP + OTP
// ---------------------------------------------------------------------------

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup.ejs', { ...seoPages.signup, message: undefined })
})

// Email Transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GOOGLE_EMAIL,
    pass: GOOGLE_APP_PASSWORD
  }
});

// --- WhatsApp Notification Helper ---
async function sendAdminWhatsApp(message) {
  try {
    const adminPhone = process.env.ADMIN_PHONE;
    const apiKey = process.env.CALLMEBOT_API_KEY;
    
    if (!adminPhone || !apiKey) {
      console.warn("WhatsApp credentials missing in .env");
      return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodedMessage}&apikey=${apiKey}`);
    console.log("✅ WhatsApp notification sent to admin.");
  } catch (error) {
    console.error("❌ Failed to send WhatsApp notification:", error.message);
  }
}

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// FIX: rate limited, passwords are now hashed with bcrypt before saving, and
// the "email already registered" message is now generic to avoid leaking
// which emails already have accounts (email enumeration).
// app.post('/signup', authLimiter, checkNotAuthenticated, async (req, res) => {
//   try {
//     const existingUser = await userModel.findOne({ signupEmail: req.body.signupEmail });
//     if (existingUser) {
//       // FIX: generic message instead of confirming the email exists
//       req.flash('error', 'Unable to sign up with the provided details');
//       return res.render('signup.ejs', { message: "Unable to sign up with the provided details. Please check your information or try logging in.", status: "error" });
//     }

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     // FIX: hash the password before storing it. Never store plaintext passwords.
//     const hashedPassword = await bcrypt.hash(req.body.signupPassword, 12);

//     const newUser = new userModel({
//       signupName: req.body.signupName,
//       signupEmail: req.body.signupEmail,
//       signupPassword: hashedPassword, // FIX: was storing req.body.signupPassword in plaintext
//       otp: otp,
//       otpExpiry: otpExpiry
//     });
//     const newProfile = new profileInfoModel({
//       user: newUser._id
//     })

//     await newUser.save();
//     await newProfile.save()
//     await transporter.sendMail({
//       from: GOOGLE_EMAIL,
//       to: req.body.signupEmail,
//       subject: 'OTP Verification',
//       text: `${otp} is your verification code for Jamhuri Afya Health Tracker.\n Please enter it within 10 minutes to verify your account.\n Thank you for choosing us`
//     });

//     console.log('User registered. Please verify OTP sent to email');
//     res.render("verifyOtp.ejs", { message: undefined, email: req.body.signupEmail })
//   } catch (err) {
//     console.error('Error signing up user:', err);
//     res.render('signup.ejs', { message: "Error Signing up user", status: "error" });
//   }
// });

// FIX: rate limited to slow brute forcing of the 6-digit OTP.
// NOTE: this still deletes the pending user record on a wrong OTP, which lets
// a stranger who knows/guesses someone's signup email grief their signup by
// submitting one bad code. Consider tracking failed attempts instead of an
// instant delete, e.g. only delete after N failures or once otpExpiry passes.
// app.post("/verifyOtp", authLimiter, async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await userModel.findOne({ signupEmail: email });

//     if (!user) return res.render('signup.ejs', { message: "User not found", status: "error" });
//     if (user.isVerified) return res.render('signup.ejs', { message: "User already verified", status: "error" });

//     if (user.otp !== otp || user.otpExpiry < new Date()) {
//       await userModel.deleteOne({ signupEmail: email })
//       return res.render('signup.ejs', { message: " Wrong or Expired OTP", status: "error" });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     return res.render('login.ejs', { message: "OTP verified you can now log in", status: "success" });
//   } catch (error) {
//     res.render('signup.ejs', { message: "Error verifying OTP", status: "error" });
//     console.error("Error :", error)
//   }
// })

app.post("/feedback", async (req, res) => {
  try {
    const { feedback } = req.body;
    const newFeedback = new feedbackModel({ feedback });
    await newFeedback.save();
    console.log("Feedback saved to MongoDB");
    formResponse(req, res, { success: true, message: 'Feedback submitted successfully!' })
  } catch (error) {
    console.error("Error saving feedback:", error);
    formResponse(req, res, { success: false, message: 'Error saving feedback. Please try again.', statusCode: 500 })
  }
});

app.post("/contact", async (req, res) => {
  let name;
  if (req.body?.firstName && req.body?.lastName) {
    name = `${req.body.firstName} ${req.body.lastName}`
  } else {
    name = req.body?.name
  }

  try {
    const newContact = new contactModel({
      name: name,
      email: req.body.email,
      phone: req.body.phone,
      service: req.body.service,
      message: req.body.message
    });
    await newContact.save();
    console.log("Contact saved to MongoDB");
        // --- SEND WHATSAPP MESSAGE ---
    const waMessage = `🟢 *New Contact Form Submission*\n\n*Name:* ${name}\n*Email:* ${req.body.email}\n*Phone:* ${req.body.phone || 'N/A'}\n*Topic:* ${req.body.service || 'N/A'}\n*Message:* ${req.body.message}`;
    await sendAdminWhatsApp(waMessage);

    formResponse(req, res, { success: true, message: 'Form submitted successfully!' })
  } catch (error) {
    console.error("Error saving contact:", error);
    formResponse(req, res, { success: false, message: 'Error submitting form. Please try again.', statusCode: 500 })
  }
});

// Google Authentication
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
//     res.render('index.ejs', {name: req.user.displayName, medications: undefined});
//   });
// app.get('/login-failure', (req, res) => res.send('Failed to authenticate.'));
// NOTE: this Google OAuth block is unused (GoogleStrategy is imported but never
// registered with passport.use(...)). Either wire it up properly or remove the
// import and this dead code entirely before shipping.

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

app.listen(port, () => console.log(`App is listening at http://localhost:${port}`))