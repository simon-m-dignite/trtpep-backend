const mongoose = require("mongoose");
const SchedulerUrlModel = mongoose.model("SchedulerUrl");

module.exports.SaveSchedulerUrl = async (req, res) => {
  const { url } = req.body;
  try {
    const SchedulerUrl = await SchedulerUrlModel.create(
      {
        url,
      },
      {
        new: true,
      }
    );

    res.status(201).json({ message: "Link saved", data: SchedulerUrl });
  } catch (error) {
    console.log("error >>", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.GetSchedulerUrl = async (req, res) => {
  try {
    const url = await SchedulerUrlModel.find();
    res.status(200).json({ data: url });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.UpdateSchedulerUrl = async (req, res) => {
  const { _id, url } = req.body;
  try {
    const SchedulerUrl = await SchedulerUrlModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        url,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Link updated", data: SchedulerUrl });
  } catch (error) {
    console.log("error >>", error);
    res.status(500).json({ message: "Server error" });
  }
};
