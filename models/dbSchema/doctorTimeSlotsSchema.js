const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slots: [
      {
        day: {
          type: String,
          required: true,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        breakDuration: {
          type: String,
          required: true,
        },
        breakTime: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "DoctorTimeSlots",
  }
);

mongoose.model("DoctorTimeSlots", timeSlotSchema);
