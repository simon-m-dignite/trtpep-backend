const mongoose = require("mongoose");
const CustomerModel = mongoose.model("Customers");
const LabOrderModel = mongoose.model("LabOrders");
const NewPatientModel = mongoose.model("Patients");

module.exports.FetchCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find();
    if (customers.length > 0) {
      return res.status(200).json({ message: "Customers", data: customers });
    }

    res.status(400).json({ message: "No Customer found", data: null });
  } catch (error) {
    console.log("fetch customers error >> ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.GetCustomerOrders = async (req, res) => {
  try {
    // Fetch the customer by ID
    const { _id } = req.params;

    const customer = await CustomerModel.findById({ _id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Placeholder to store all order details
    const allOrders = [];

    // Loop through the orders array in the customer document
    for (const order of customer.orders) {
      let orderDetails;

      if (order.orderType === "LabOrder") {
        orderDetails = await LabOrderModel.findById(order.orderId);
      } else if (order.orderType === "NewPatient") {
        orderDetails = await NewPatientModel.findById(order.orderId);
      }

      if (orderDetails) {
        allOrders.push(orderDetails);
      }
    }

    res.status(200).json({ data: allOrders });
  } catch (error) {
    console.error("Error fetching customer orders >>", error);
    res.status(500).json({
      message: "Error fetching customer orders",
      error: error.message,
    });
  }
};
