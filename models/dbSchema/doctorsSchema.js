const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    collection: "Doctors",
  }
);

module.exports = mongoose.model("Doctors", EnrollmentSchema);
