const { default: axios } = require("axios");
const mongoose = require("mongoose");
const LabOrderModel = mongoose.model("LabOrders");
const LabOrdersModel = mongoose.model("LabOrders");

require("dotenv").config();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

module.exports.PlaceLabOrder = async (req, res) => {
  const { captcha } = req.body;
  console.log("token_id >> ", req.body.id);

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`
    );

    if (!response.data.success) {
      return res.status(400).send({
        success: false,
        message: "Captcha verification failed. Please try again.",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(req.body.amount * 100),
      currency: "usd",
      payment_method_data: {
        type: "card",
        card: { token: req.body.id },
      },
      automatic_payment_methods: {
        enabled: false,
      },
      // confirm: true,
      // return_url: "https://trtpep.com",
    });

    await LabOrdersModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      date_of_birth: req.body.date_of_birth,
      shippingState: req.body.shippingState,
      billingAddress: req.body.billingAddress,
      billingAddressLine: req.body.billingAddressLine2,
      city: req.body.city,
      zipCode: req.body.zipCode,
      amount: req.body.amount,
      isNewPatient: req.body.isNewPatient,
    });

    res.send({
      success: true,
      message: "Payment successful",
      paymentIntent,
      captchaMessage: "Human",
    });
  } catch (error) {
    if (error.type === "StripeCardError") {
      return res.status(402).send({
        success: false,
        message: error.message || "Your card has insufficient funds.",
      });
    }

    console.log("create-payment-intent error >> ", error);
    // res.status(500).send({
    //   success: false,
    //   message:
    //     "An error occurred while processing your payment. Please try again.",
    // });
  }
};

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
