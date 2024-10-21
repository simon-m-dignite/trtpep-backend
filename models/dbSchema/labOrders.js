const mongoose = require("mongoose");

const LabOrderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date_of_birth: { type: String, required: true },
    shippingState: { type: String, required: true },
    billingAddress: { type: String, required: true },
    billingAddressLine: { type: String, required: false, default: "N/A" },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    amount: { type: String, required: true },
    // billingAddress: { type: String, required: true },
    isNewPatient: { type: String, required: true },
    orderStatus: { type: String, default: "Pending" },
    payment_status: { type: Boolean, default: false },
    invoicePath: { type: String, default: "" },
  },
  {
    collection: "LabOrders",
    timestamps: true,
  }
);

module.exports = mongoose.model("LabOrders", LabOrderSchema);
