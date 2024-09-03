const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      dob: { type: Date, required: true },
    },
    therapyDetails: {
      testosterone: {
        title: { type: String },
        price: { type: Number },
      },
      peptide: {
        title: { type: String },
        price: { type: Number },
      },
      hcg: {
        title: { type: String },
        price: { type: Number },
      },
      weightLoss: {
        title: { type: String },
        price: { type: Number },
      },
    },
    labWorkDetails: {
      bloodWorkForTestosterone: {
        title: { type: String },
        price: { type: Number },
      },
      howDidHear: { type: String },
    },
    shippingInfo: {
      shippingStreetAddress: { type: String },
      shippingAddressLine: { type: String },
      shippingCity: { type: String },
      shippingState: { type: String },
      shippingZipCode: { type: String },
      // isBillingSameAsShipping: { type: Boolean },
    },
    billingInfo: {
      billingStreetAddress: { type: String },
      billingAddressLine: { type: String },
      billingCity: { type: String },
      billingState: { type: String },
      billingZipCode: { type: String },
    },
    isBillingSameAsShipping: { type: Boolean },
    amount: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending" },
  },
  {
    collection: "Patients",
    timestamps: true,
  }
);

module.exports = mongoose.model("Patients", PatientSchema);
