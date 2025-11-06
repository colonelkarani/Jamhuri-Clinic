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
const profileInfoSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  height : Number,
  phone: String,
  bloodType : String,
  chronicConditions : String,
  allergies : String,
  primaryPhysician : String,
  physicianPhone : String,
  emergencyRelation : String,
  emergencyName : String,
  emergencyPhone : String,
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
    notesOrLocation: String,
  date: { type: Date, required: true }
}
)

const BPReadingModel = mongoose.model('BPReading', BPReadingSchema);
const heartRateModel = mongoose.model('heartRate', heartRateSchema);
const profileInfoModel = mongoose.model('profileInfo', profileInfoSchema);
const weightModel = mongoose.model('weight', weightSchema);
const medicationModel = mongoose.model('medication', medicationSchema);
const bloodSugarModel = mongoose.model('bloodSugar', bloodSugarSchema);
const appointmentModel = mongoose.model('appointment', appointmentSchema);
const oxygenSaturationModel = mongoose.model('oxygenSaturation', oxygenSaturationSchema);

module.exports = {
  BPReadingModel,
  weightModel,
  profileInfoModel,
  heartRateModel, 
  medicationModel,
  oxygenSaturationModel,
  bloodSugarModel,
  appointmentModel,
};
