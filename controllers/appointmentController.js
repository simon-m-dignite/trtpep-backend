const mongoose = require("mongoose");
const AppointmentModel = mongoose.model("Appointments");
const ServiceModal = mongoose.model("DoctorServices");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const BookedAppointments = mongoose.model("BookedAppointments");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "professorcoding123@gmail.com",
    pass: "bhmkhbxysiztceii",
  },
});

// const CLIENT_ID = "your-google-client-id";
// const CLIENT_SECRET = "your-google-client-secret";
// const REDIRECT_URI = "http://localhost:5173/:doctorId";

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// module.exports.BookAppointment = async (req, res) => {
//   try {
//     const {
//       selectedServices,
//       selectedDate,
//       selectedTime,
//       // patientFirstName,
//       // patientLastName,
//       // patientEmail,
//       // patientPhoneNumber,
//       patient,
//       accountNumber,
//     } = req.body;

//     console.log("appointment api >> ", req.body);

//     for (const serviceId of selectedServices) {
//       const service = await ServiceModal.findById(serviceId);

//       if (service) {
//         service.timeSlots.forEach((slot) => {
//           if (
//             slot.start === selectedTime.start &&
//             slot.end === selectedTime.end
//           ) {
//             slot.isBooked = true;
//           }
//         });

//         await service.save();
//       }
//     }

//     await AppointmentModel.create({
//       selectedServices,
//       selectedDate,
//       selectedTime,
//       patient,
//       // patientFirstName,
//       // patientLastName,
//       // patientEmail,
//       // patientPhoneNumber,
//       accountNumber,
//     });

//     res.status(200).json({
//       status: 200,
//       message: "Meeting link has been sent to your email address.",
//     });
//   } catch (error) {
//     console.log("BookAppointment error >> ", error);
//     res.status(500).send({ message: "Something went wrong", error });
//   }
// };

// my workign controller

module.exports.BookAppointment = async (req, res) => {
  const {
    selectedServices,
    selectedDate,
    selectedTime,
    patient,
    accountNumber,
    doctorId,
    meetUrl,
    amount,
  } = req.body;

  try {
    const existingAppointment = await BookedAppointments.findOne({
      doctorId,
      startTime: selectedTime.startTime,
      endTime: selectedTime.endTime,
      date: selectedDate,
      status: "Booked",
    });

    if (existingAppointment) {
      return res.status(400).json({
        code: 400,
        message:
          "The selected time slot is already booked. Please choose a different timeslot or date.",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
    });
    console.log("paymentIntent >>", paymentIntent);

    const newAppointment = new AppointmentModel({
      doctorId,
      selectedServices,
      selectedDate,
      selectedTime,
      patient,
      accountNumber,
      meetUrl,
    });

    const markAnAppointment = new BookedAppointments({
      doctorId,
      services: selectedServices,
      startTime: selectedTime.startTime,
      endTime: selectedTime.endTime,
      date: selectedDate,
      status: "Booked",
    });

    await newAppointment.save();
    await markAnAppointment.save();

    return res.json({
      message: "Appointment booked successfully",
      data: paymentIntent.client_secret,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while booking the appointment.",
      error: error.message,
    });
  }
};

module.exports.AppointmentPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.SendEmail = async (req, res) => {
  const { doctorEmail, patientEmail, meetLink } = req.body;
  console.log("send email >> ", req.body);

  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: "info@trtpep.com",
    to: ["smshoaib2001@gmail.com", patientEmail],
    subject: "Google Meet Link for Your Appointment",
    text: `Hello,\n\nHere is your Google Meet link for the upcoming appointment: ${meetLink}\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};

// module.exports.checkAppointmentAvailability = async (req, res) => {
//   try {
//     const { selectedServices, doctorId, timeSlot, selectedDate } = req.body;
//     console.log("availability checked", timeSlot);

//     if (!selectedServices) {
//       return res.status(403).send({ message: "Please select a service" });
//     }

//     if (!selectedDate) {
//       console.log("selectedDate >> ", selectedDate);
//       return res.status(403).send({ message: "Please select a date" });
//     }

//     for (const serviceId of selectedServices) {
//       const service = await ServiceModal.findOne({
//         _id: serviceId,
//         doctorId: doctorId,
//       });

//       if (service) {
//         const slot = service.timeSlots.find(
//           (slot) =>
//             // slot.startTime === timeSlot.startTime &&
//             // slot.endTime === timeSlot.endTime
//             slot._id == timeSlot._id
//         );

//         console.log("slot >> ", slot);
//         const dateObj = new Date(selectedDate);
//         const formattedDate = dateObj.toLocaleDateString("en-US", {
//           weekday: "short", // 'Fri'
//           year: "numeric", // '2024'
//           month: "short", // 'Oct'
//           day: "numeric", // '18'
//         });

//         if (slot) {
//           if (slot.isBooked) {
//             return res.status(400).json({
//               status: 400,
//               message: `The time slot ${timeSlot.startTime} - ${timeSlot.endTime} is alread booked on ${formattedDate}.`,
//             });
//           }
//         } else {
//           return res.status(404).json({
//             status: 404,
//             message: `Time slot ${timeSlot.start} - ${timeSlot.end} not found.`,
//           });
//         }
//       } else {
//         return res.status(404).json({
//           status: 404,
//           message: `Service not found for service ID: ${serviceId} and doctor ID: ${doctorId}.`,
//         });
//       }
//     }

//     res.status(200).json({
//       status: 200,
//       message: "Time slot is available for booking.",
//     });
//   } catch (error) {
//     console.log("Error in checkAppointmentAvailability >> ", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// };

module.exports.checkAppointmentAvailability = async (req, res) => {
  try {
    const { selectedServices, doctorId, selectedDate } = req.body;

    if (!selectedServices) {
      return res.status(403).send({ message: "Please select a service" });
    }

    if (!selectedDate) {
      console.log("selectedDate >> ", selectedDate);
      return res.status(403).send({ message: "Please select a date" });
    }

    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "short", // 'Fri'
      year: "numeric", // '2024'
      month: "short", // 'Oct'
      day: "numeric", // '18'
    });

    // Array to store available slots
    let availableSlots = [];

    // Loop through selected services to find available slots
    for (const serviceId of selectedServices) {
      const service = await ServiceModal.findOne({
        _id: serviceId,
        doctorId: doctorId,
      });

      if (service) {
        // Filter the available slots that are not booked for the selected date
        const availableServiceSlots = service.timeSlots.filter((slot) => {
          return !slot.isBooked;
        });

        if (availableServiceSlots.length > 0) {
          availableSlots.push({
            serviceId: serviceId,
            doctorId: doctorId,
            date: formattedDate,
            availableSlots: availableServiceSlots,
          });
        } else {
          availableSlots.push({
            serviceId: serviceId,
            doctorId: doctorId,
            date: formattedDate,
            availableSlots: [], // No slots available
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: `Service not found for service ID: ${serviceId} and doctor ID: ${doctorId}.`,
        });
      }
    }

    // If there are no available slots, return appropriate response
    if (availableSlots.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `No available time slots for the selected service(s) on ${formattedDate}.`,
      });
    }

    // Return the available slots for the services
    res.status(200).json({
      status: 200,
      message: "Available time slots fetched successfully.",
      data: availableSlots,
    });
  } catch (error) {
    console.log("Error in checkAppointmentAvailability >> ", error);
    res.status(500).send({ message: "Server error", error });
  }
};

module.exports.FetchDoctorAppointment = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Step 1: Fetch doctor appointments
    const doctorAppointments = await AppointmentModel.find({ doctorId });

    // Step 2: Check if there are any appointments
    if (doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No Appointments Found" });
    }

    // Step 3: Extract selected service IDs from the appointments
    const selectedServiceIds = doctorAppointments.flatMap(
      (appointment) => appointment.selectedServices
    );

    // Step 4: Fetch services based on selected service IDs
    const services = await ServiceModal.find({
      _id: { $in: selectedServiceIds },
    });

    // Step 5: Combine appointments with their corresponding services
    const appointmentsWithServices = doctorAppointments.map((appointment) => {
      return {
        ...appointment._doc, // Include all original appointment fields
        services: services.filter((service) =>
          appointment.selectedServices.includes(service._id.toString())
        ), // Attach matching services
      };
    });

    // Step 6: Return the response with appointments and their services
    return res
      .status(200)
      .json({ message: "success", data: appointmentsWithServices });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
