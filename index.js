const express = require("express");
const cors = require("cors");
require("dotenv").config();
var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
  optionsSuccessStatus: 200,
};
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Stripe = require("stripe");
const { DBConnection } = require("./models/dbConnection");
const { default: axios } = require("axios");
const PORT = process.env.PORT;

const app = express();

// Middlewares here
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

DBConnection();
// schemas
require("./models/dbSchema/userSchema");
require("./models/dbSchema/otpSchema");
require("./models/dbSchema/labOrders");
require("./models/dbSchema/NewPatientSchema");
require("./models/dbSchema/enrollSchema");
require("./models/dbSchema/doctorsSchema");
require("./models/dbSchema/serviceSchema");
require("./models/dbSchema/appointmentsSchema");

// routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/patientRoutes"));
app.use("/api", require("./routes/labOrderRoutes"));
app.use("/api", require("./routes/doctorRoutes"));
app.use("/api", require("./routes/serviceRoutes"));
app.use("/api", require("./routes/appointmentRoutes"));

const LabOrdersModel = mongoose.model("LabOrders");
const NewPatientModel = mongoose.model("Patients");

// Routes here
app.get("/hello", (req, res) => {
  res.send("Hello World");
});

const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

// lab orders
app.post("/api/create-payment-intent", cors(corsOptions), async (req, res) => {
  const { captcha } = req.body;
  console.log("token_id >> ", req.body.id);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "usd",
      payment_method_data: {
        type: "card",
        card: { token: req.body.id },
      },
      confirm: true,
      return_url: "https://trtpep.com",
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

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`
    );

    if (response.data.success) {
      // res.send("Human 👨 👩");
      res.send({
        success: true,
        message: "Payment successful",
        paymentIntent,
        captchaMessage: "Human",
      });
    } else {
      // res.send("Robot 🤖");
      res.send({
        success: true,
        message: "Payment successful",
        paymentIntent,
        captchaMessage: "Robot",
      });
    }

    // res.send({
    //   success: true,
    //   message: "Payment successful",
    //   paymentIntent,
    // });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
    console.log("create-payment-intent error >> ", error);
  }
});

// new patient - old patient
app.post("/api/new-patient", cors(corsOptions), async (req, res) => {
  const { formData, id, amount } = req.body;
  // console.log("Received data:", req.body.formData.therapyDetails.testosterone);

  const {
    therapyDetails,
    labWorkDetails,
    patientInfo,
    shippingInfo,
    billingInfo,
    isBillingSameAsShipping,
  } = formData;

  const { testosterone, peptide, hcg, weightLoss } = therapyDetails;

  const { bloodWorkForTestosterone, howDidHear } = labWorkDetails;

  const { firstName, lastName, email, phoneNumber, dob } = patientInfo;

  const {
    shippingStreetAddress,
    shippingAddressLine,
    shippingCity,
    shippingState,
    shippingZipCode,
  } = shippingInfo;

  const {
    billingStreetAddress,
    billingAddressLine,
    billingCity,
    billingState,
    billingZipCode,
  } = billingInfo;

  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "usd",
      payment_method_data: {
        type: "card",
        card: { token: req.body.id },
      },
      confirm: true,
      return_url: "https://www.dignitestudios.com",
    });

    const newPatient = new NewPatientModel({
      therapyDetails: {
        testosterone,
        peptide,
        hcg,
        weightLoss,
      },
      labWorkDetails: {
        bloodWorkForTestosterone,
        howDidHear,
      },
      patientInfo: {
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
      },
      shippingInfo: {
        shippingStreetAddress,
        shippingAddressLine,
        shippingCity,
        shippingState,
        shippingZipCode,
      },
      billingInfo: {
        billingStreetAddress,
        billingAddressLine,
        billingCity,
        billingState,
        billingZipCode,
      },
      isBillingSameAsShipping,
      amount,
    });

    const savedPatient = await newPatient.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: savedPatient,
      // paymentIntent,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
    console.log("new-patient error >> ", error);
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
