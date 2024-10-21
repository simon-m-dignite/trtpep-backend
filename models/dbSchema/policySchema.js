const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["Privacy Policy", "Terms of Service", "Cancelation Policy"],
      required: true,
      unique: true,
    },
  },
  {
    collection: "PrivacyPolicy",
  }
);

module.exports = mongoose.model("PrivacyPolicy", policySchema);
