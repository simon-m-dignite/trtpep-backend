const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  supplyDuration: { type: "String", required: true },
  isInStock: { type: Boolean, required: false, default: true },
});

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: { type: [optionSchema], required: true },
});

const labWorkOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: { type: [optionSchema], required: true },
});

const formSchema = new mongoose.Schema({
  therapies: { type: [therapySchema], required: true },
  labWork: {
    type: [labWorkOptionSchema],
    required: false,
  },
});

module.exports = mongoose.model("Products", formSchema);
