const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: false,
    default: 0,
  },
  endTime: {
    type: String,
    required: false,
    default: 0,
  },
  isBooked: { type: Boolean, required: false, default: false },
});

const EnrollmentSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    serviceSubtitle: {
      type: String,
      required: false,
      unique: true,
      default: "",
    },
    price: { type: Number, required: false, default: 0 },
    duration: { type: String, required: true },
    timeSlots: { type: [timeSlotSchema], required: true },
  },
  {
    collection: "DoctorServices",
  }
);

module.exports = mongoose.model("DoctorServices", EnrollmentSchema);
