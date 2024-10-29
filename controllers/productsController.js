const mongoose = require("mongoose");
const ProductModal = mongoose.model("Products");

// create product
module.exports.AddProducts = async (req, res) => {
  try {
    const { therapies, labWork } = req.body;

    const labWorkEntry = {
      name: labWork.name,
      options: labWork.options,
    };

    const formEntry = new ProductModal({
      therapies,
      labWork: labWorkEntry,
    });

    const savedEntry = await formEntry.save();

    res.status(201).json({
      message: "Form data saved successfully",
      data: savedEntry,
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.UpdateProductById = async (req, res) => {
  try {
    const { _id } = req.params;
    const { therapies, labWork } = req.body;

    const updatedEntry = await ProductModal.findByIdAndUpdate(
      { _id },
      {
        therapies,
        labWork,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.FetchProducts = async (req, res) => {
  try {
    const products = await ProductModal.find();
    res.status(200).json({ message: "success", products });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
