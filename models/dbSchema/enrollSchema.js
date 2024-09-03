const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true },
  },
  {
    collection: "EnrolledPatients",
  }
);

module.exports = mongoose.model("EnrolledPatients", EnrollmentSchema);
