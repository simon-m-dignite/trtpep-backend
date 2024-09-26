const { useStripe } = require("@stripe/react-stripe-js");
const mongoose = require("mongoose");
const PatientModel = mongoose.model("Patients");
const EnrollmentModel = mongoose.model("EnrolledPatients");
const NewPatientModel = mongoose.model("Patients");
require("dotenv").config();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

module.exports.FetchPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find();

    if (patients.length === 0 || patients.length < 0 || patients === null) {
      return res.status(404).json({
        status: 404,
        message: "No Patient Founds",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Patients",
      patients,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

module.exports.FetchPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientInfo = await PatientModel.findById({ _id: id });
    if (!patientInfo) {
      return res.status(404).json({
        status: 404,
        message: "Patient Not Found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      patient: patientInfo,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

module.exports.EnrollPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(phoneNumber);
    const user = await EnrollmentModel.findOne({ email });
    if (user) {
      return res.status(200).json({
        status: 200,
        message: "You are already enrolled.",
      });
    }

    await EnrollmentModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    res
      .status(200)
      .json({ status: 200, message: "You are enrolled successfully." });
  } catch (error) {
    console.log("enrollPatient error >> ", error);
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};

module.exports.FetchEnrolledPatients = async (req, res) => {
  try {
    const enrolledPatients = await EnrollmentModel.find();
    if (enrolledPatients.length === 0 || enrolledPatients.length === null) {
      return res.status(200).json({ message: "No Enrolled Patient Found" });
    }
    res.status(200).json({
      status: 200,
      message: "Enrolled Patients",
      data: enrolledPatients,
    });
  } catch (error) {
    console.log(" >> ", error);
    res.status(500).json({ status: 500, message: "Server Error", error });
  }
};

module.exports.GetEnrolledPatient = async (req, res) => {
  try {
    const { id } = req.body;
    const patient_data = await EnrollmentModel.findById({ _id: id });
    if (!patient_data) {
      return res.status(404).json({ status: 404, message: "No Patient Found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Success", data: patient_data });
  } catch (error) {
    console.log("GetEnrolledPatient error >> ", error);
    res.status(500).json({ status: 500, message: "Server Error", error });
  }
};

module.exports.SearchPatient = async (req, res) => {
  try {
    const { shippingState, email } = req.body;
    console.log(req.body);
    if (!email || !shippingState) {
      return res.status(400).json({ error: "Email and state are required" });
    }

    try {
      const patient = await PatientModel.findOne({
        "patientInfo.email": email,
        "shippingInfo.shippingState": shippingState,
      });
      if (patient) {
        res.json({ patient, status: 200, message: "Success" });
      } else {
        res.status(404).json({ message: "Patient not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.log("SearchPatient error >> ", error);
    res.status(500).json({ status: 500, message: "Server Error", error });
  }
};

// update order status api
module.exports.UpdateorderStatus = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { orderStatus } = req.body;

    console.log(patientId);
    console.log(orderStatus);

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      { _id: patientId },
      { orderStatus },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ status: 404, message: "Order Not Found" });
    }

    res.status(200).json({
      status: 200,
      message: "Order Status Updated",
      data: updatedPatient,
    });
  } catch (error) {
    console.log("UpdateOrderStatus error >> ", error);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};

module.exports.FilterPatients = async (req, res) => {
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

    const patients = await PatientModel.find({
      createdAt: { $gte: start, $lte: end }, // Adjust field name as necessary
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error filtering patients:", error);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};

module.exports.NewPatient = async (req, res) => {
  const { formData, amount } = req.body;

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
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: req.body.amount * 100,
    //   currency: "usd",
    //   payment_method_data: {
    //     type: "card",
    //     card: { token: req.body.id },
    //   },
    //   confirm: true,
    //   return_url: "https://www.dignitestudios.com",
    // });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Patient Form",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://trtpep.com/new-patient/success",
      cancel_url: "https://trtpep.com/new-patient/failed",
    });

    const newPatient = new NewPatientModel.create({
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

    res.status(200).json({
      success: true,
      message: "Payment Url generated successfully.",
      data: newPatient,
      url: session.url,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
    console.log("new-patient error >> ", error);
  }
};

module.exports.UpdateNewPatientStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await NewPatientModel.findByIdAndUpdate({
        _id: id,
        payment_status: true,
      });
      res.status(200).send({ message: "Success" });
    } else {
      res.status(400).send({ message: "Id not found." });
    }
  } catch (error) {
    console.error("Error UpdateNewPatientStatus patients:", error);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};
