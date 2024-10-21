const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
  {
    collection: "Blogs",
  }
);

module.exports = mongoose.model("Blogs", BlogSchema);
