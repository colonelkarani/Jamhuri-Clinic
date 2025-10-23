const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  signupName: {
    type: String,
    required: true
  },
  signupEmail: {
    type: String,
    required: true,
    unique: true
  },
  signupPassword: {
    type: String,
    required: true
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('signupPassword')) return next();
  this.signupPassword = await bcrypt.hash(this.signupPassword, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
