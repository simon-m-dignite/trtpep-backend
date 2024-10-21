const mongoose = require("mongoose");

const BookedAppointmentsSchema = new mongoose.Schema(
  {
    doctorId: { type: String },
    services: { type: Array },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String },
  },
  { collection: "BookedAppointments" }
);

module.exports = mongoose.model("BookedAppointments", BookedAppointmentsSchema);
