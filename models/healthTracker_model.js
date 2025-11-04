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


const weightSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weight : Number,
  date: { type: Date, default: Date.now }
}
)

const oxygenSaturationSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    oxygenSaturation : Number,
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
    status: String,
  date: { type: Date, default: Date.now }
}
)

const appointmentSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
    title : String,
    drName : String,
    time: String,
    status: String,
  date: { type: Date, default: Date.now }
}
)

const BPReadingModel = mongoose.model('BPReading', BPReadingSchema);
const heartRateModel = mongoose.model('heartRate', heartRateSchema);
const weightModel = mongoose.model('weight', weightSchema);
const medicationModel = mongoose.model('medication', medicationSchema);
const bloodSugarModel = mongoose.model('bloodSugar', bloodSugarSchema);
const appointmentModel = mongoose.model('appointment', appointmentSchema);
const oxygenSaturationModel = mongoose.model('oxygenSaturation', oxygenSaturationSchema);

module.exports = {
  BPReadingModel,
  weightModel,
  heartRateModel, 
  medicationModel,
  oxygenSaturationModel,
  bloodSugarModel,
  appointmentModel,
};
