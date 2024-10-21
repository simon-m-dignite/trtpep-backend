const mongoose = require("mongoose");

const PricesSchema = new mongoose.Schema(
  {
    deliveryCharges: { type: Number, required: true, default: 0 },
    labOrdersCharges: { type: Number, required: true, default: 0 },
  },
  {
    collection: "Prices",
  }
);

module.exports = mongoose.model("Prices", PricesSchema);
