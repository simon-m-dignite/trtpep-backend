const mongoose = require("mongoose");

const SchedulerUrlSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true, default: "" },
    url: { type: String, required: true, default: 0 },
  },
  {
    collection: "SchedulerUrl",
  }
);

module.exports = mongoose.model("SchedulerUrl", SchedulerUrlSchema);
