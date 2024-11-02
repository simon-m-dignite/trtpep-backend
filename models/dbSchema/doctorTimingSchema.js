const { default: mongoose } = require("mongoose");

const DoctorTimingSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctors" },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    shiftStartTime: String,
    shiftEndTime: String,
    breakStartTime: String,
    breakDuration: { type: Number, enum: [30, 60] }, // break duration in minutes
  },
  {
    collection: "DoctorTimeSlots",
  }
);

module.exports = mongoose.model("DoctorTimeSlots", DoctorTimingSchema);
