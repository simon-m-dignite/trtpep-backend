const mongoose = require("mongoose");

const LabOrderModel = mongoose.model("LabOrders");

module.exports.FetchLabOrders = async (req, res) => {
  try {
    const labOrders = await LabOrderModel.find();

    if (labOrders.length === 0 || labOrders.length < 0 || labOrders === null) {
      return res.status(404).json({
        status: 404,
        message: "No Lab Orders Founds",
      });
    }

    res.status(200).json({
      status: 200,
      message: "labOrders",
      labOrders,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

module.exports.FetchLabOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const labOrder = await LabOrderModel.findById({ _id: id });
    if (!labOrder) {
      return res.status(404).json({
        status: 404,
        message: "Patient Not Found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      labOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

// update order status api
module.exports.UpdateLabOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    console.log(orderId);
    console.log(orderStatus);

    const updatedOrder = await LabOrderModel.findByIdAndUpdate(
      { _id: orderId },
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ status: 404, message: "Order Not Found" });
    }

    res.status(200).json({
      status: 200,
      message: "Order Status Updated",
      data: updatedOrder,
    });
  } catch (error) {
    console.log("Update Order Status error >> ", error);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};

module.exports.FilterLabOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid date range" });
    }

    // Convert query parameters to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    const patients = await LabOrderModel.find({
      createdAt: { $gte: start, $lte: end }, // Adjust field name as necessary
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error filtering patients:", error);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};
