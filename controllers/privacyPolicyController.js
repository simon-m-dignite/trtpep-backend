const mongoose = require("mongoose");
const PrivacyPolicyModel = mongoose.model("PrivacyPolicy");

module.exports.CreatePolicy = async (req, res) => {
  const newPolicy = new PrivacyPolicyModel(req.body);
  try {
    const savedPolicy = await newPolicy.save();
    res.status(201).json(savedPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.GetPrivacyPolicy = async (req, res) => {
  const { type } = req.params;
  try {
    const policy = await PrivacyPolicyModel.findOne({ type });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res
      .status(200)
      .json({ message: "Policy found successfully", data: policy });
  } catch (error) {
    res.status(500).json({ message: "Error deleting policy", error });
  }
};

module.exports.UpdatePolicy = async (req, res) => {
  const { title, content } = req.body;
  const { type } = req.params;

  try {
    const updatedPolicy = await PrivacyPolicyModel.findOneAndUpdate(
      { type },
      { title, content },
      {
        new: true,
      }
    );

    if (!updatedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    return res
      .status(200)
      .json({ message: "Policy updated successfully", data: "updatedPolicy" });
  } catch (error) {
    console.error("Error updating policy:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
