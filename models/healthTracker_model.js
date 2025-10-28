const mongoose = require("mongoose")

const BPReadingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  systolic: Number,
  diastolic: Number,
  date: { type: Date, default: Date.now }
});

const heartRateSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  heartRate : Number,
  date: { type: Date, default: Date.now }
}
)

const temperatureSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  temperature : Number,
  date: { type: Date, default: Date.now }
}
)
const weightSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weight : Number,
  date: { type: Date, default: Date.now }
}
)

const respRateSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    respRate : Number,
  date: { type: Date, default: Date.now }
}
)

const bloodSugarSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodSugar : Number,
    measurementTime : String,
    notes: String,
  date: { type: Date, default: Date.now }
}
)

const medicationSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name : String,
    dosage : String,
    frequency : String,
    status: String,
  date: { type: Date, default: Date.now }
}
)

const appointmentSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title : String,
    drName : String,
    status: String,
  date: { type: Date, default: Date.now }
}
)

const BPReading = mongoose.model('BPReading', BPReadingSchema);
const respRate = mongoose.model('respRate', respRateSchema);
const weight = mongoose.model('weight', weightSchema);
const temperature = mongoose.model('temperature', temperatureSchema);
const medication = mongoose.model('medication', medicationSchema);
const bloodSugar = mongoose.model('bloodSugar', bloodSugarSchema);
const appointment = mongoose.model('appointment', appointmentSchema);

module.exports = {
  BPReading,
  respRate,
  weight,
  temperature,
  medication,
  bloodSugar,
  appointment,
};
