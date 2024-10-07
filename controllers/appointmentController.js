const mongoose = require("mongoose");
const AppointmentModel = mongoose.model("Appointments");
const ServiceModal = mongoose.model("DoctorServices");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

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

module.exports.BookAppointment = async (req, res) => {
  const {
    selectedServices,
    selectedDate,
    selectedTime,
    patient,
    accountNumber,
    doctorId,
  } = req.body;
  console.log(req.body);

  // Check if timeslot is available by verifying existing appointments
  const existingAppointments = await AppointmentModel.find({
    doctorId,
    selectedDate,
  });

  let isTimeslotAvailable = true;
  existingAppointments.forEach((appointment) => {
    if (
      appointment.timeslot.startTime === timeslot.startTime &&
      appointment.timeslot.endTime === timeslot.endTime
    ) {
      isTimeslotAvailable = false;
    }
  });

  if (!isTimeslotAvailable) {
    return res
      .status(400)
      .json({ message: "Selected timeslot is not available" });
  }

  // Create new appointment
  const newAppointment = new AppointmentModel({
    doctorId,
    selectedServices,
    selectedDate,
    selectedTime,
    patient,
    accountNumber,
  });

  await newAppointment.save();
  res.json({
    message: "Appointment booked successfully",
    appointment: newAppointment,
  });
};

module.exports.SendEmail = async (req, res) => {
  const { doctorEmail, patientEmail, meetLink } = req.body;
  console.log("send email >> ", req.body);

  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: "info@trtpep.com",
    to: [doctorEmail, patientEmail],
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

module.exports.checkAppointmentAvailability = async (req, res) => {
  try {
    const { selectedServices, doctorId, timeSlot, selectedDate } = req.body;
    console.log("availability checked", req.body);

    if (!selectedServices) {
      return res.status(403).send({ message: "Please select a service" });
    }

    if (!selectedDate) {
      console.log("selectedDate >> ", selectedDate);
      return res.status(403).send({ message: "Please select a date" });
    }

    for (const serviceId of selectedServices) {
      const service = await ServiceModal.findOne({
        _id: serviceId,
        doctorId: doctorId,
      });

      if (service) {
        const slot = service.timeSlots.find(
          (slot) => slot.start === timeSlot.start && slot.end === timeSlot.end
        );

        if (slot) {
          if (slot.isBooked) {
            return res.status(400).json({
              status: 400,
              message: `The time slot ${timeSlot.start} - ${timeSlot.end} on ${selectedDate} is already booked.`,
            });
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: `Time slot ${timeSlot.start} - ${timeSlot.end} not found.`,
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: `Service not found for service ID: ${serviceId} and doctor ID: ${doctorId}.`,
        });
      }
    }

    res.status(200).json({
      status: 200,
      message: "Time slot is available for booking.",
    });
  } catch (error) {
    console.log("Error in checkAppointmentAvailability >> ", error);
    res.status(500).send({ message: "Server error", error });
  }
};
