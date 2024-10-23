const mongoose = require("mongoose");
const PricesModel = mongoose.model("Prices");
const SchedulerUrlModel = mongoose.model("SchedulerUrl");

module.exports.CreateDeliveryCharges = async (req, res) => {
  try {
    const { name, charges } = req.body;
    const response = new PricesModel({
      name,
      charges,
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
    const { charges } = req.body;
    const { _id } = req.params;

    const updatedDeliveryCharges = await PricesModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        charges,
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
      message: "Price updated successfully.",
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
    const schedulerUrl = await SchedulerUrlModel.find();
    res.status(200).json({ message: "Success", data: prices, schedulerUrl });
  } catch (error) {
    console.log("GetPrices error >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.GetChargesById = async (req, res) => {
  try {
    const { _id } = req.params;
    const findCharges = await PricesModel.findById({ _id });
    if (!findCharges) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "success", data: findCharges });
  } catch (error) {
    console.log("error >>", error);
    res.status(500).json({ message: "Server error", error });
  }
};
