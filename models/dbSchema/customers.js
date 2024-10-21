const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    orderType: {
      type: String,
    },
    orderAmount: { type: String },
    lastOrderDate: { type: Date },
    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
        orderType: {
          type: String,
          enum: ["LabOrder", "NewPatient"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
  {
    collection: "Customers",
  }
);

module.exports = mongoose.model("Customers", CustomerSchema);
