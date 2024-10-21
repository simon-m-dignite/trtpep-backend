// const mongoose = require("mongoose");

// const PatientSchema = new mongoose.Schema(
//   {
//     patientInfo: {
//       firstName: { type: String, required: true },
//       lastName: { type: String, required: true },
//       email: { type: String, required: true },
//       phoneNumber: { type: String, required: true },
//       dob: { type: Date, required: true },
//     },
//     therapyDetails: {
//       testosterone: {
//         title: { type: String },
//         price: { type: Number },
//       },
//       peptide: {
//         title: { type: String },
//         price: { type: Number },
//       },
//       hcg: {
//         title: { type: String },
//         price: { type: Number },
//       },
//       weightLoss: {
//         title: { type: String },
//         price: { type: Number },
//       },
//     },
//     labWorkDetails: {
//       bloodWorkForTestosterone: {
//         title: { type: String },
//         price: { type: Number },
//       },
//       howDidHear: { type: String },
//     },
//     shippingInfo: {
//       shippingStreetAddress: { type: String },
//       shippingAddressLine: { type: String },
//       shippingCity: { type: String },
//       shippingState: { type: String },
//       shippingZipCode: { type: String },
//       // isBillingSameAsShipping: { type: Boolean },
//     },
//     billingInfo: {
//       billingStreetAddress: { type: String },
//       billingAddressLine: { type: String },
//       billingCity: { type: String },
//       billingState: { type: String },
//       billingZipCode: { type: String },
//     },
//     isBillingSameAsShipping: { type: Boolean },
//     amount: { type: Number, required: true },
//     orderStatus: { type: String, default: "Pending" },
//     payment_status: { type: Boolean, default: false },
//     invoicePath: { type: String },
//   },
//   {
//     collection: "Patients",
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Patients", PatientSchema);

const mongoose = require("mongoose");

const therapySchema = new mongoose.Schema({
  therapyName: { type: String, required: true },
  selectedOptionName: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  supplyDuration: { type: String, required: true },
});

const labWorkSchema = new mongoose.Schema({
  therapyName: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

const patientInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dob: { type: Date, required: true },
});

const addressSchema = new mongoose.Schema({
  shippingStreetAddress: { type: String, required: true },
  shippingAddressLine: { type: String },
  shippingCity: { type: String, required: true },
  shippingState: { type: String, required: true },
  shippingZipCode: { type: String, required: true },
});

const billingSchema = new mongoose.Schema({
  billingStreetAddress: { type: String, required: false },
  billingAddressLine: { type: String, required: false },
  billingCity: { type: String, required: false },
  billingState: { type: String, required: false },
  billingZipCode: { type: String, required: false },
});

const orderSchema = new mongoose.Schema(
  {
    patient: {
      patientInfo: patientInfoSchema,
      shippingInfo: addressSchema,
      billingInfo: billingSchema,
      isBillingSameAsShipping: { type: Boolean, required: true },
    },
    amount: { type: Number, required: true },
    selectedTherapies: [therapySchema],
    selectedLabWork: [labWorkSchema],
    howDidHear: { type: String },
    orderStatus: { type: String, default: "Pending" },
    payment_status: { type: Boolean, default: false },
    invoicePath: { type: String },
  },
  { timestamps: true },
  {
    collection: "Patients",
  }
);

module.exports = mongoose.model("Patients", orderSchema);
