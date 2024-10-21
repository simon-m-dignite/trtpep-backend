const mongoose = require("mongoose");

// const AppointmentSchema = new mongoose.Schema(
//   {
//     selectedServices: { type: Array, required: true },
//     selectedDate: { type: String, required: true },
//     selectedTime: { type: String, required: true },
//     patientFirstName: { type: String, required: true },
//     patientLastName: { type: String, required: true },
//     patientEmail: { type: String, required: true },
//     patientPhoneNumber: { type: String, required: true },
//     accountNumber: { type: String, required: true },
//   },
//   {
//     collection: "Appointments",
//   }
// );

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
  selectedServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorServices",
      required: true,
    },
  ],
  selectedDate: { type: String, required: true },
  selectedTime: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  status: { type: String, default: "booked" },
  accountNumber: { type: String, required: false },
  meetUrl: { type: String, required: false, default: "" },
});

module.exports = mongoose.model("Appointments", AppointmentSchema);
