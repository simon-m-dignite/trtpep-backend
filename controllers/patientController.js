const { useStripe } = require("@stripe/react-stripe-js");
const mongoose = require("mongoose");
const PatientModel = mongoose.model("Patients");
const EnrollmentModel = mongoose.model("EnrolledPatients");
const NewPatientModel = mongoose.model("Patients");
require("dotenv").config();
const Stripe = require("stripe");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const CustomersModel = mongoose.model("Customers");

const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

module.exports.NewPatient = async (req, res) => {
  const { formData, amount, selectedTherapies, selectedLabWork, howDidHear } =
    req.body;

  const { patientInfo, shippingInfo, billingInfo, isBillingSameAsShipping } =
    formData;
  const { firstName, lastName, email, phoneNumber, dob } = patientInfo;

  try {
    let stripeCustomer;

    const existingStripeCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingStripeCustomers.data.length > 0) {
      stripeCustomer = existingStripeCustomers.data[0];
    } else {
      stripeCustomer = await stripe.customers.create({
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phoneNumber,
        address: {
          line1: billingInfo.billingStreetAddress,
          line2: billingInfo.billingAddressLine,
          city: billingInfo.billingCity,
          state: billingInfo.billingState,
          postal_code: billingInfo.billingZipCode,
          country: "US",
        },
      });
    }

    const product = await stripe.products.create({
      name: "Patient Form Order",
      description: `Therapies: ${selectedTherapies.map(
        (therapy) => therapy.therapyName
      )}. Lab Work: ${selectedLabWork.map((lab) => lab.name)}.`,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount * 100),
      currency: "usd",
    });

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id, // Associate session with the customer
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/new-patient/success",
      cancel_url: "http://localhost:5173/new-patient/failed",
    });

    const newPatient = await NewPatientModel.create({
      patient: formData,
      amount,
      selectedTherapies,
      selectedLabWork,
      howDidHear,
    });

    const existingPatient = await NewPatientModel.findOne({
      "patientInfo.email": email,
    });

    const isCustomer = await CustomersModel.findOne({
      email,
    });

    if (isCustomer) {
      await CustomersModel.findOneAndUpdate(
        { email: patientInfo.email },
        {
          lastOrderDate: Date.now(),
          $push: {
            orders: {
              orderId: newPatient._id,
              orderType: "NewPatient",
            },
          },
        },
        {
          new: true,
        }
      );
    } else {
      const customer = await CustomersModel.create({
        name: `${patientInfo.firstName} ${patientInfo.lastName}`,
        email: patientInfo.email,
        phone: patientInfo.phoneNumber,
        address: billingInfo.billingStreetAddress,
        orderType: "NewPatient",
        orderAmount: amount,
        lastOrderDate: Date.now(),
        orders: {
          orderId: newPatient._id,
          orderType: "NewPatient",
        },
      });
      await customer.save();
    }

    const invoiceFileName = `invoice-${newPatient._id}.pdf`;

    const invoiceFilePath = path.join(
      __dirname,
      "../invoices",
      invoiceFileName
    );
    await generateInvoicePDF(invoiceFilePath, newPatient);

    newPatient.invoicePath = `/invoices/${invoiceFileName}`;
    await newPatient.save();

    await sendEmailWithAttachment({
      to: email,
      subject: "Your Patient Order Invoice",
      text: `Dear ${firstName},\n\nPlease find attached your invoice for the patient order.\n\nThank you!`,
      attachments: [
        {
          filename: invoiceFileName,
          path: invoiceFilePath,
        },
      ],
    });

    res.status(200).json({
      success: true,
      message:
        "Payment URL generated successfully, Stripe customer and product created, and invoice sent to the patient.",
      data: newPatient,
      url: session.url,
      invoicePath: newPatient.invoicePath,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    console.error("new-patient error >> ", error);
  }
};

// Helper function to generate PDF invoice
async function generateInvoicePDF(filePath, patient) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // Title of the invoice
  doc.fontSize(20).text("Invoice", { align: "center" });

  // Patient information
  doc
    .fontSize(14)
    .text(
      `Patient Invoice: ${patient.patient.patientInfo.firstName} ${patient.patient.patientInfo.lastName}`,
      { align: "left" }
    );

  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(
    2,
    "0"
  )}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(
    currentDate.getFullYear()
  ).slice(-2)}`;
  doc.text(`Order Date: ${formattedDate}`, {
    align: "left",
    margin: "10px 0px",
  });

  // Add therapies with their details
  doc.fontSize(14).text("Therapies Ordered:", { align: "left" });

  patient.selectedTherapies.forEach((therapy) => {
    doc
      .fontSize(12)
      .text(
        `${therapy?.therapyName} - ${therapy?.selectedOptionName} - $${therapy?.totalPrice}`,
        { align: "left" }
      );
  });

  // doc.fontSize(14).text("Therapies Selected:", { align: "left" });

  patient.selectedLabWork.forEach((therapy) => {
    doc
      .fontSize(12)
      .text(
        `${therapy?.name} - ${
          therapy?.selectedOptionName !== undefined
            ? therapy?.selectedOptionName
            : null
        } - $${therapy?.totalPrice}`,
        { align: "left" }
      );
  });

  // Shipping information
  const {
    shippingStreetAddress,
    shippingCity,
    shippingState,
    shippingZipCode,
  } = patient.patient.shippingInfo;
  doc.text(
    `Shipping Address: ${shippingStreetAddress}, ${shippingCity}, ${shippingState}, ${shippingZipCode}`,
    { align: "left", margin: "10px 0px" }
  );

  // Order amount
  doc.text(`Total Amount: $${patient.amount}`, { align: "left" });

  // Finalize the PDF
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function sendEmailWithAttachment({ to, subject, text, attachments }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "professorcoding123@gmail.com",
      pass: "bhmkhbxysiztceii",
    },
  });

  const mailOptions = {
    from: "info@trtpep.com",
    to,
    subject,
    text,
    attachments,
  };

  return transporter.sendMail(mailOptions);
}

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
    const { email } = req.params;
    const patient_data = await EnrollmentModel.find({ email });
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

module.exports.FetchPatientInfoByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email);

    const patient = await NewPatientModel.find({
      "patient.patientInfo.email": email,
    });

    if (!patient) {
      return res.status(404).json({
        status: 404,
        message: "Patient Not Found",
      });
    }

    console.log(patient);

    res.status(200).json({
      statusCode: 200,
      message: "Success",
      patient,
    });
  } catch (error) {
    console.error("Error fetching patient info >> ", error);
    res.status(500).json({
      status: 500,
      message: "Server Error",
      error,
    });
  }
};
