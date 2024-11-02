const { default: mongoose } = require("mongoose");

const doctorSlotSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    date: Date, // specific day
    slots: [
      {
        time: String,
        isAvailable: Boolean,
      },
    ],
  },
  {
    collection: "DoctorSlot",
  }
);

module.exports = mongoose.model("DoctorSlot", doctorSlotSchema);
