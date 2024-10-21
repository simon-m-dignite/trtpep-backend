const mongoose = require("mongoose");
const PricesModel = mongoose.model("Prices");

module.exports.CreateDeliveryCharges = async (req, res) => {
  try {
    const { deliveryCharges, labOrdersCharges } = req.body;
    const response = new PricesModel({
      deliveryCharges,
      labOrdersCharges,
    });

    const savedEntry = await response.save();

    res.status(201).json({
      message: "Prices Added",
      data: savedEntry,
    });
  } catch (error) {
    console.log("DeliveryCharges >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.UpdateDeliveryCharges = async (req, res) => {
  try {
    const { deliveryCharges, id, labOrdersCharges } = req.body;
    const updatedDeliveryCharges = await PricesModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        deliveryCharges: deliveryCharges,
        labOrdersCharges,
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
      message: "Prices updated successfully.",
      data: updatedDeliveryCharges,
    });
  } catch (error) {
    console.log("UpdateDeliveryCharges >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.GetPrices = async (req, res) => {
  try {
    const prices = await PricesModel.find();
    res.status(200).json({ message: "Success", data: prices });
  } catch (error) {
    console.log("GetPrices error >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};
