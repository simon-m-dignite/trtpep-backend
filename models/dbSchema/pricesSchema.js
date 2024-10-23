const mongoose = require("mongoose");

const PricesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "" },
    charges: { type: Number, required: true, default: 0 },
  },
  {
    collection: "Prices",
  }
);

module.exports = mongoose.model("Prices", PricesSchema);
