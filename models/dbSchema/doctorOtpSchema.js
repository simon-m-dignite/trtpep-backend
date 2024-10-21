const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    // maxTries: { type: Number, default: 3 },
    lastRequestTime: { type: Date, default: Date.now },
  },
  {
    collection: "DoctorOTP",
    timestamps: false,
  }
);

module.exports = mongoose.model("DoctorOTP", OTPSchema);
