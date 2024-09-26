const { default: axios } = require("axios");
const mongoose = require("mongoose");
const LabOrderModel = mongoose.model("LabOrders");
const LabOrdersModel = mongoose.model("LabOrders");

require("dotenv").config();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

module.exports.PlaceLabOrder = async (req, res) => {
  const {
    captcha,
    amount,
    firstName,
    lastName,
    email,
    phone,
    date_of_birth,
    shippingState,
    billingAddress,
    billingAddressLine,
    city,
    zipCode,
    isNewPatient,
  } = req.body;

  try {
    // Verify Captcha
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`
    );

    if (!captchaResponse.data.success) {
      return res.status(400).send({
        success: false,
        message: "Captcha verification failed. Please try again.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Lab Order Form",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        capture_method: "automatic", // or use "manual" if you want to capture later
        setup_future_usage: "off_session", // Helps trigger 3D Secure when necessary
      },
      success_url: "https://trtpep.com/lab-order/success",
      cancel_url: "https://trtpep.com/lab-order/failed",
    });

    const labOrder = await LabOrdersModel.create({
      firstName,
      lastName,
      email,
      phone,
      date_of_birth,
      shippingState,
      billingAddress,
      billingAddressLine,
      city,
      zipCode,
      amount,
      isNewPatient,
    });

    // Send the saved lab order data in the response
    res.status(200).send({
      success: true,
      message: "Payment URL generated",
      url: session.url, // Assuming `session.url` is your payment URL
      data: labOrder, // The saved lab order document
    });

    // Create Payment Intent with Stripe
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Amount in cents
    //   currency: "usd",
    //   payment_method_data: {
    //     type: "card",
    //     card: { token: id }, // Using token from frontend
    //   },
    //   automatic_payment_methods: { enabled: true }, // Automatic 3D Secure handling
    //   confirm: true, // Immediately confirm the payment
    // });

    // Save order to database after successful payment

    // Send response back to frontend with payment status and client secret
    // res.send({
    //   success: true,
    //   message: "Payment successful",
    //   clientSecret: paymentIntent?.client_secret, // Client secret for further confirmation if needed
    //   captchaMessage: "Human",
    // });
  } catch (error) {
    console.error("Error during payment creation >> ", error);

    // Handle Stripe-specific errors
    // if (error.type === "StripeCardError") {
    //   return res.status(402).send({
    //     success: false,
    //     message: error.message || "Your card has insufficient funds.",
    //   });
    // }

    // Generic error response
    res.status(500).send({
      success: false,
      message:
        "An error occurred while processing your payment. Please try again.",
    });
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

module.exports.UpdateLabOrderPaymentStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await LabOrderModel.findByIdAndUpdate({ _id: id, payment_status: true });
      res.status(200).send({ message: "Success" });
    } else {
      res.status(400).send({ message: "Id not found." });
    }
  } catch (error) {
    console.error("Error UpdateNewPatientStatus patients:", error);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};
