const mongoose = require("mongoose");
const PricesModel = mongoose.model("Prices");

module.exports.CreateDeliveryCharges = async (req, res) => {
  try {
    const { deliveryCharges } = req.body;
    const response = new PricesModel({
      deliveryCharges,
    });

    const savedEntry = await response.save();

    res.status(201).json({
      message: "Form data saved successfully",
      data: savedEntry,
    });
  } catch (error) {
    console.log("DeliveryCharges >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.UpdateDeliveryCharges = async (req, res) => {
  try {
    const { deliveryCharges, id } = req.body;
    const updatedDeliveryCharges = await PricesModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        deliveryCharges: deliveryCharges,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDeliveryCharges) {
      return res.status(404).json({ message: "Price not found" });
    }

    res.status(200).json({
      message: "Delivery charges changed successfully.",
      data: updatedDeliveryCharges,
    });
  } catch (error) {
    console.log("UpdateDeliveryCharges >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};
