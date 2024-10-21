const mongoose = require("mongoose");
const FAQModel = mongoose.model("FAQ");

module.exports.AddFaqs = async (req, res) => {
  try {
    const { faqs } = req.body;

    const savedFaqs = await FAQModel.insertMany(faqs);

    res
      .status(201)
      .json({ message: "FAQs added successfully", data: savedFaqs });
  } catch (error) {
    console.error("Error adding FAQs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.FetchFaqs = async (req, res) => {
  try {
    const faqs = await FAQModel.find();
    res.status(200).json({ message: "success", data: faqs });
  } catch (error) {
    console.log("FetchFaqs error >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.DeleteFaq = async (req, res) => {
  try {
    const faqId = req.params.id;

    const deletedFaq = await FAQModel.findByIdAndDelete(faqId);

    if (!deletedFaq) {
      return res.status(404).json({
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      message: "FAQ deleted successfully",
      data: deletedFaq,
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({
      message: "Server error while deleting FAQ",
      error,
    });
  }
};

module.exports.UpdateFaq = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { question, answer } = req.body;

  try {
    const updatedFaq = await FAQModel.findByIdAndUpdate(
      { _id: id },
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFaq,
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports.getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await FAQModel.findById({ _id: id });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
