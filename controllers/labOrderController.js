const { default: axios } = require("axios");
const mongoose = require("mongoose");
const LabOrderModel = mongoose.model("LabOrders");
const LabOrdersModel = mongoose.model("LabOrders");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const CustomersModel = mongoose.model("Customers");

require("dotenv").config();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

// module.exports.PlaceLabOrder = async (req, res) => {
//   const {
//     captcha,
//     amount,
//     firstName,
//     lastName,
//     email,
//     phone,
//     date_of_birth,
//     shippingState,
//     billingAddress,
//     billingAddressLine,
//     city,
//     zipCode,
//     isNewPatient,
//   } = req.body;
//   console.log("api called >> ");

//   try {
//     const captchaResponse = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`
//     );

//     if (!captchaResponse.data.success) {
//       return res.status(400).send({
//         success: false,
//         message: "Captcha verification failed. Please try again.",
//       });
//     }

//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Lab Order Form",
//             },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "https://trtpep.com/lab-order/success",
//       cancel_url: "https://trtpep.com/lab-order/failed",
//     });

//     const labOrder = await LabOrdersModel.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       date_of_birth,
//       shippingState,
//       billingAddress,
//       billingAddressLine,
//       city,
//       zipCode,
//       amount,
//       isNewPatient,
//     });

//     // Generate Invoice
//     const invoiceNumber = `INV-${Date.now()}`;
//     const invoicePath = path.join(__dirname, `invoice_${invoiceNumber}.pdf`);

//     generateInvoice(
//       labOrder,
//       invoiceNumber,
//       invoicePath,
//       async (invoicePath) => {
//         // Send the invoice email
//         await sendInvoiceEmail(email, invoicePath);

//         // Send response
//         res.status(200).send({
//           success: true,
//           message: "Payment URL generated and invoice sent to email",
//           url: session.url,
//           data: labOrder,
//         });
//       }
//     );

//     // res.status(200).send({
//     //   success: true,
//     //   message: "Payment URL generated",
//     //   url: session.url,
//     //   data: labOrder,
//     // });
//   } catch (error) {
//     console.error("Error during payment creation >> ", error);

//     res.status(500).send({
//       success: false,
//       message:
//         "An error occurred while processing your payment. Please try again.",
//     });
//   }
// };

// // Generate Invoice Function
// const generateInvoice = (labOrder, invoiceNumber, invoicePath, callback) => {
//   const doc = new PDFDocument();
//   doc.pipe(fs.createWriteStream(invoicePath));

//   // Invoice Header
//   doc.fontSize(20).text("INVOICE", { align: "center" });
//   doc.moveDown();

//   // Company Info
//   doc.fontSize(10).text("Your Company Name", 100, 80);
//   doc.text("Your Company Address", 100, 95);
//   doc.text("your-email@example.com", 100, 110);
//   doc.text("Phone: 123-456-7890", 100, 125);

//   // Invoice Number and Dates
//   doc.text(`Invoice Number: ${invoiceNumber}`, 400, 80);
//   doc.text(`Invoice Date: ${new Date().toISOString().split("T")[0]}`, 400, 95);

//   doc.moveDown(2);

//   // Customer Info
//   doc.text(`Bill To:`, 100, 150);
//   doc.text(`${labOrder.firstName} ${labOrder.lastName}`, 100, 165);
//   doc.text(`${labOrder.email}`, 100, 180);
//   doc.text(
//     `${labOrder.billingAddress}, ${labOrder.city}, ${labOrder.shippingState}`,
//     100,
//     195
//   );
//   doc.text(`${labOrder.zipCode}`, 100, 210);

//   doc.moveDown(2);

//   // Order Summary
//   doc.fontSize(12).text("Order Summary:", { align: "left" });
//   doc.moveDown(1);
//   doc.fontSize(10);

//   doc.text("Item", 100, 240);
//   doc.text("Qty", 300, 240);
//   doc.text("Unit Price", 350, 240);
//   doc.text("Total Price", 450, 240);

//   doc.text("Lab Order Form", 100, 260);
//   doc.text("1", 300, 260);
//   doc.text(`$${labOrder.amount}`, 350, 260);
//   doc.text(`$${labOrder.amount}`, 450, 260);

//   doc.moveDown(2);
//   doc.text(`Total: $${labOrder.amount}`, 450, 300);

//   doc.moveDown(2);
//   doc.text("Thank you for your business!", 100, 340);

//   // Finalize the PDF and call the callback
//   doc.end();
//   callback(invoicePath);
// };

const sendInvoiceEmail = async (email, invoicePath) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "professorcoding123@gmail.com",
      pass: "bhmkhbxysiztceii",
    },
  });

  let mailOptions = {
    from: "info@trtpep.com",
    to: email,
    subject: "TRTPEP Lab Order Invoice Receipt",
    text: "Please find your invoice attached.",
    attachments: [
      {
        filename: path.basename(invoicePath),
        path: invoicePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);

  fs.unlink(invoicePath, (err) => {
    if (err) console.log(err);
    console.log("Invoice file deleted.");
  });
};

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
    // Validate captcha
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`
    );

    if (!captchaResponse.data.success) {
      return res.status(400).send({
        success: false,
        message: "Captcha verification failed. Please try again.",
      });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Only Lab Order",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5174/lab-order/success",
      cancel_url: "http://localhost:5174/lab-order/failed",
    });

    // Save lab order in the database
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

    // Update or create customer record
    const isOldCustomer = await CustomersModel.findOne({ email });

    if (isOldCustomer) {
      await CustomersModel.findOneAndUpdate(
        { email },
        {
          lastOrderDate: Date.now(),
          $push: {
            orders: {
              orderId: labOrder._id,
              orderType: "LabOrder",
            },
          },
        },
        {
          new: true,
        }
      );
    } else {
      const customer = await CustomersModel.create({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        address: billingAddress,
        orderType: "LabOrder",
        orderAmount: amount,
        lastOrderDate: Date.now(),
        orders: {
          orderId: labOrder._id,
          orderType: "LabOrder",
        },
      });

      await customer.save();
    }

    // Generate PDF Invoice
    const doc = new PDFDocument();
    const invoicePath = path.join(
      __dirname,
      "../invoices/invoice-" + labOrder._id + ".pdf"
    ); // Updated path to store in main directory
    const pdfStream = fs.createWriteStream(invoicePath);
    doc.pipe(pdfStream);

    // Add content to the PDF
    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Order ID: ${labOrder._id}`, { align: "left", margin: "10px 0px" });
    doc.text(`Name: ${firstName} ${lastName}`);
    doc.text(`Email: ${email}`, { margin: "10px 0px" });
    doc.text(`Phone: ${phone}`);
    doc.text(
      `Billing Address: ${billingAddress}, ${billingAddressLine}, ${city}, ${shippingState}, ${zipCode}`,
      { margin: "10px 0px" }
    );
    doc.text(`Amount: $${amount}`);
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
    doc.end();

    // Send email with invoice
    pdfStream.on("finish", async () => {
      await sendEmailWithAttachment({
        to: email,
        subject: "Your Invoice For Lab Order",
        text: "Thank you for your order. Please find your invoice attached.",
        attachments: [
          {
            filename: `invoice-${labOrder._id}.pdf`,
            path: invoicePath,
          },
        ],
      });

      // Save the relative URL for the invoice
      const invoiceURL = `/invoices/invoice-${labOrder._id}.pdf`;
      labOrder.invoicePath = invoiceURL;
      await labOrder.save();

      // Respond with success and the Stripe URL
      res.status(200).send({
        success: true,
        message: "Payment URL generated and invoice sent.",
        url: session.url,
        data: labOrder,
      });
    });
  } catch (error) {
    console.error("Error during payment creation >> ", error);

    res.status(500).send({
      success: false,
      message:
        "An error occurred while processing your payment. Please try again.",
    });
  }
};

const sendEmailWithAttachment = async ({ to, subject, text, attachments }) => {
  try {
    // Create a transporter using SMTP or another email service like Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "professorcoding123@gmail.com",
        pass: "bhmkhbxysiztceii",
      },
    });

    // Email options
    const mailOptions = {
      from: "info@trtpep.com", // Your email address
      to, // Recipient email address
      subject, // Email subject
      text, // Email body
      attachments, // Attachments array with file data
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// fetch all lab orders
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

// fetch lab order by id
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

// filter lab orders by date
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

// get lab orders by email
module.exports.FetchLabOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email);
    const labOrder = await LabOrdersModel.find({ email });
    if (!labOrder) {
      return res.status(404).json({
        status: 404,
        message: "Patient Not Found",
      });
    } else if (labOrder.length === 0) {
      return res.status(404).json({
        message: "No orders found for the provided email address.",
        statusCode: 404,
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
