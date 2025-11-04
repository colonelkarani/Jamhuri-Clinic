const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET


function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      // Wait for possible database query (async function)
      const user = await getUserByEmail(email);
      
      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      // Validate password using bcrypt
      const match = await bcrypt.compare(password, user.signupPassword);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  };

 passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

//   passport.use("google",new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: 'http://localhost:3000/auth/google/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//     return done(null, profile);
//   }
// ));

  // Serialize user to store their ID in the session
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserialize user by fetching them from MongoDB
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
}

module.exports = initialize;
