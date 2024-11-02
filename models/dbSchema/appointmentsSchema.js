const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
    required: true,
  },
  patient: {
    patientFirstName: { type: String, required: true },
    patientLastName: { type: String, required: true },
    patientPhoneNumber: { type: String, required: true },
    patientEmail: { type: String, required: true },
  },
  selectedServices: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorServices",
    required: true,
  },
  selectedDate: { type: String, required: true },

  status: { type: String, default: "booked" },
  accountNumber: { type: String, required: false },
  meetUrl: { type: String, required: false, default: "" },
  appointmentDate: Date,
  startTime: Date,
  serviceDuration: { type: Number, enum: [30, 60] },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients",
    required: true,
  },
});

module.exports = mongoose.model("Appointments", AppointmentSchema);
