const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    required: true
  }
  ,
  reason: {
    type: String,
    required: true
  },
  notes: String
});



module.exports = mongoose.model('Appointment', appointmentSchema);
