const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true
  }
});



module.exports = mongoose.model('Feedback', feedbackSchema);
