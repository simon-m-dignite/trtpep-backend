const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    selectedServices: { type: Array, required: true },
    selectedDate: { type: String, required: true },
    selectedTime: { type: String, required: true },
    patientFirstName: { type: String, required: true },
    patientLastName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhoneNumber: { type: String, required: true },
    accountNumber: { type: String, required: true },
  },
  {
    collection: "Appointments",
  }
);

module.exports = mongoose.model("Appointments", AppointmentSchema);
