// const mongoose = require("mongoose");
// const DoctorSlot = mongoose.model("DoctorSlot");

// const AppointmentModel = mongoose.model("Appointments");
// const ServiceModal = mongoose.model("DoctorServices");
// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const BookedAppointments = mongoose.model("BookedAppointments");
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);
// const DoctorTimeSlots = mongoose.model("DoctorTimeSlots");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   auth: {
//     user: "professorcoding123@gmail.com",
//     pass: "bhmkhbxysiztceii",
//   },
// });

// // const CLIENT_ID = "your-google-client-id";
// // const CLIENT_SECRET = "your-google-client-secret";
// // const REDIRECT_URI = "http://localhost:5173/:doctorId";

// // const oAuth2Client = new google.auth.OAuth2(
// //   CLIENT_ID,
// //   CLIENT_SECRET,
// //   REDIRECT_URI
// // );

// module.exports.BookAppointment = async (req, res) => {
//   const {
//     selectedServices,
//     selectedDate,
//     selectedTime,
//     patient,
//     accountNumber,
//     doctorId,
//     meetUrl,
//     amount,
//   } = req.body;

//   try {
//     const existingAppointment = await BookedAppointments.findOne({
//       doctorId,
//       startTime: selectedTime.startTime,
//       endTime: selectedTime.endTime,
//       date: selectedDate,
//       status: "Booked",
//     });

//     if (existingAppointment) {
//       return res.status(400).json({
//         code: 400,
//         message:
//           "The selected time slot is already booked. Please choose a different timeslot or date.",
//       });
//     }

//     let paymentIntent = null;

//     // Only create a payment intent if the amount is greater than 0
//     if (amount > 0) {
//       paymentIntent = await stripe.paymentIntents.create({
//         amount: amount * 100, // Convert to cents
//         currency: "usd",
//       });
//     }

//     const newAppointment = new AppointmentModel({
//       doctorId,
//       selectedServices,
//       selectedDate,
//       selectedTime,
//       patient,
//       accountNumber,
//       meetUrl,
//     });

//     const markAnAppointment = new BookedAppointments({
//       doctorId,
//       services: selectedServices,
//       startTime: selectedTime.startTime,
//       endTime: selectedTime.endTime,
//       date: selectedDate,
//       status: "Booked",
//     });

//     await newAppointment.save();
//     await markAnAppointment.save();

//     return res.json({
//       message: "Appointment booked successfully",
//       ...(paymentIntent && { clientSecret: paymentIntent.client_secret }),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "An error occurred while booking the appointment.",
//       error: error.message,
//     });
//   }
// };

// module.exports.SendEmail = async (req, res) => {
//   const { doctorEmail, patientEmail, meetLink } = req.body;
//   // console.log("send email >> ", req.body);

//   const mailOptions = {
//     from: "info@trtpep.com",
//     to: [doctorEmail, patientEmail],
//     subject: "Google Meet Link for Your Appointment",
//     text: `Hello,\n\nHere is your Google Meet link for the upcoming appointment: ${meetLink}\n\nThank you!`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Emails sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Error sending email" });
//   }
// };

// module.exports.AppointmentPayment = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//     });

//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// };

// module.exports.checkAppointmentAvailability = async (req, res) => {
//   try {
//     const { selectedServices, doctorId, selectedDate } = req.body;

//     if (!selectedServices) {
//       return res.status(403).send({ message: "Please select a service" });
//     }

//     if (!selectedDate) {
//       console.log("selectedDate >> ", selectedDate);
//       return res.status(403).send({ message: "Please select a date" });
//     }

//     const dateObj = new Date(selectedDate);
//     const formattedDate = dateObj.toLocaleDateString("en-US", {
//       weekday: "short", // 'Fri'
//       year: "numeric", // '2024'
//       month: "short", // 'Oct'
//       day: "numeric", // '18'
//     });

//     // Array to store available slots
//     let availableSlots = [];

//     // Loop through selected services to find available slots
//     for (const serviceId of selectedServices) {
//       const service = await ServiceModal.findOne({
//         _id: serviceId,
//         doctorId: doctorId,
//       });

//       if (service) {
//         // Filter the available slots that are not booked for the selected date
//         const availableServiceSlots = service.timeSlots.filter((slot) => {
//           return !slot.isBooked;
//         });

//         if (availableServiceSlots.length > 0) {
//           availableSlots.push({
//             serviceId: serviceId,
//             doctorId: doctorId,
//             date: formattedDate,
//             availableSlots: availableServiceSlots,
//           });
//         } else {
//           availableSlots.push({
//             serviceId: serviceId,
//             doctorId: doctorId,
//             date: formattedDate,
//             availableSlots: [], // No slots available
//           });
//         }
//       } else {
//         return res.status(404).json({
//           status: 404,
//           message: `Service not found for service ID: ${serviceId} and doctor ID: ${doctorId}.`,
//         });
//       }
//     }

//     // If there are no available slots, return appropriate response
//     if (availableSlots.length === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: `No available time slots for the selected service(s) on ${formattedDate}.`,
//       });
//     }

//     // Return the available slots for the services
//     res.status(200).json({
//       status: 200,
//       message: "Available time slots fetched successfully.",
//       data: availableSlots,
//     });
//   } catch (error) {
//     console.log("Error in checkAppointmentAvailability >> ", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// };

// module.exports.FetchDoctorAppointment = async (req, res) => {
//   try {
//     const { doctorId } = req.params;

//     // Step 1: Fetch doctor appointments
//     const doctorAppointments = await AppointmentModel.find({ doctorId });

//     // Step 2: Check if there are any appointments
//     if (doctorAppointments.length === 0) {
//       return res.status(404).json({ message: "No Appointments Found" });
//     }

//     // Step 3: Extract selected service IDs from the appointments
//     const selectedServiceIds = doctorAppointments.flatMap(
//       (appointment) => appointment.selectedServices
//     );

//     // Step 4: Fetch services based on selected service IDs
//     const services = await ServiceModal.find({
//       _id: { $in: selectedServiceIds },
//     });

//     // Step 5: Combine appointments with their corresponding services
//     const appointmentsWithServices = doctorAppointments.map((appointment) => {
//       return {
//         ...appointment._doc, // Include all original appointment fields
//         services: services.filter((service) =>
//           appointment.selectedServices.includes(service._id.toString())
//         ), // Attach matching services
//       };
//     });

//     // Step 6: Return the response with appointments and their services
//     return res
//       .status(200)
//       .json({ message: "success", data: appointmentsWithServices });
//   } catch (error) {
//     return res.status(500).json({ message: "Something went wrong", error });
//   }
// };

const mongoose = require("mongoose");
const AppointmentModel = mongoose.model("Appointments");
const ServiceModal = mongoose.model("DoctorServices");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const BookedAppointments = mongoose.model("BookedAppointments");
const Stripe = require("stripe");
const {
  convertToDate,
  convertTimeToISO,
  isWithinShiftAndNotBreak,
  convertToTime,
  getDayFromDate,
} = require("../utils/helperFunctions");
const stripe = Stripe(process.env.STRIPE_INTENT_TOKEN);
const DoctorTimeSlots = mongoose.model("DoctorTimeSlots");
// new code
const DoctorSlot = mongoose.model("DoctorSlot");

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

module.exports.GetSlots = async (req, res) => {
  const { doctorId, appointmentDate } = req.body;
  try {
    const day = getDayFromDate(appointmentDate);
    const appointmentDateNew = convertToDate(appointmentDate);
    const doctorTiming = await DoctorTimeSlots.findOne({ doctorId, day });
    if (!doctorTiming) {
      return res.status(404).json({
        error: "Doctor is not available at the provided day.",
        slots: [],
      });
    }

    let existingSlot = await DoctorSlot.findOne({
      doctorId,
      date: appointmentDateNew,
    });

    if (existingSlot) {
      res.status(200).json({
        message: "Existing Slots fetched successfully.",
        slots: existingSlot?.slots,
      });
    } else {
      const shiftStart = new Date(doctorTiming.shiftStartTime);
      const shiftEnd = new Date(doctorTiming.shiftEndTime);

      const slots = [];
      let slotTime = new Date(shiftStart.getTime());
      while (slotTime < shiftEnd) {
        const slotFormattedTime = convertToTime(slotTime); // Convert slotTime to "HH:MM"

        const isAvailable = true;

        if (isWithinShiftAndNotBreak(doctorTiming, slotTime)) {
          slots.push({
            time: slotFormattedTime, // Store the actual Date object
            isAvailable: isAvailable, // Determine availability based on time comparison
          });
        }

        slotTime = new Date(slotTime.getTime() + 30 * 60000);
      }

      return res.status(200).json({
        message: "Slots fetched successfully.",
        slots,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.BookAppointment = async (req, res) => {
  const {
    selectedServices,
    selectedDate,
    patient,
    accountNumber,
    doctorId,
    meetUrl,
    amount,
    appointmentDate,
    serviceDuration,
    time,
    orderId,
  } = req.body;
  // console.log("appointment data >>", req.body);

  try {
    const formattedDate = new Date(appointmentDate);
    const appointmentDateNew = convertToDate(appointmentDate);
    const formattedStartTime = convertTimeToISO(appointmentDateNew, time);
    const startTime = convertTimeToISO(appointmentDateNew, time);

    let existingSlot = await DoctorSlot.findOne({
      doctorId,
      date: appointmentDateNew,
    });

    if (existingSlot) {
      const day = getDayFromDate(appointmentDate);
      const doctorTiming = await DoctorTimeSlots.findOne({ doctorId, day });
      if (!doctorTiming) {
        return res.status(400).json({
          error: "Doctor is not available at the provided day.",
        });
      }
      const validDoctorTime = isWithinShiftAndNotBreak(doctorTiming, startTime);
      // console.log(validDoctorTime);

      if (!validDoctorTime) {
        return res.status(400).json({
          error: "Doctor is not available at the provided slot.",
        });
      }

      const slotToBook = existingSlot.slots.find(
        (slot) =>
          slot.time == convertToTime(formattedStartTime) && slot.isAvailable
      );

      if (!slotToBook) {
        return res
          .status(400)
          .json({ error: "Doctor is not available at the selected slot." });
      }

      if (serviceDuration === 60) {
        const nextSlotTime = convertToTime(
          new Date(formattedStartTime).getTime() + 30 * 60000
        );
        const nextSlotToBook = existingSlot.slots.find(
          (slot) => slot.time == nextSlotTime && slot.isAvailable
        );
        if (!nextSlotToBook) {
          return res.status(400).json({
            error:
              "You have selected hourly service, but doctor is not availble for an hourly slot at provided time.",
          });
        }
        nextSlotToBook.isAvailable = false;
      }
      slotToBook.isAvailable = false;

      await existingSlot.save();

      const newAppointment = new AppointmentModel({
        doctorId,
        selectedServices,
        selectedDate,
        patient,
        accountNumber,
        meetUrl,
        appointmentDate: formattedDate,
        startTime: formattedStartTime,
        serviceDuration,
        orderId,
      });

      let paymentIntent = null;

      // Only create a payment intent if the amount is greater than 0
      if (amount > 0) {
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: "usd",
        });
      }

      await newAppointment.save();

      return res.status(200).json({
        message: "Appointment booked successfully",
        appointment: {
          doctorId,
          appointmentDate: formattedDate,
          startTime: formattedStartTime,
          serviceDuration,
        },
        ...(paymentIntent && { clientSecret: paymentIntent.client_secret }),
      });
    } else {
      const day = getDayFromDate(appointmentDate);
      const doctorTiming = await DoctorTimeSlots.findOne({ doctorId, day });
      if (!doctorTiming) {
        return res.status(400).json({
          error: "Doctor is not available at the provided day.",
        });
      }
      const validDoctorTime = isWithinShiftAndNotBreak(doctorTiming, startTime);

      if (!validDoctorTime) {
        return res.status(400).json({
          error: "Doctor is not available at the provided slot.",
        });
      }

      const shiftStart = new Date(doctorTiming.shiftStartTime);
      const shiftEnd = new Date(doctorTiming.shiftEndTime);

      const slots = [];
      let slotTime = new Date(shiftStart.getTime());
      while (slotTime < shiftEnd) {
        const slotFormattedTime = convertToTime(slotTime); // Convert slotTime to "HH:MM"

        const isAvailable =
          slotFormattedTime !== convertToTime(formattedStartTime);
        if (isWithinShiftAndNotBreak(doctorTiming, slotTime)) {
          slots.push({
            time: slotFormattedTime, // Store the actual Date object
            isAvailable: isAvailable, // Determine availability based on time comparison
          });
        }

        slotTime = new Date(slotTime.getTime() + 30 * 60000);
      }

      // Book the next slot if serviceDuration is 60
      if (serviceDuration === 60) {
        const nextSlotTime = convertToTime(
          new Date(formattedStartTime).getTime() + 30 * 60000
        );
        const nextSlot = slots.find((slot) => slot.time == nextSlotTime);
        if (!nextSlot) {
          return res.status(400).json({
            error:
              "You have selected hourly service, but doctor is not availble for an hourly slot at provided time.",
          });
        }
        nextSlot.isAvailable = false;
      }

      await DoctorSlot.create({
        doctorId,
        date: appointmentDateNew,
        slots,
      });

      const newAppointment = new AppointmentModel({
        doctorId,
        selectedServices,
        selectedDate,
        patient,
        accountNumber,
        meetUrl,
        appointmentDate: formattedDate,
        startTime: formattedStartTime,
        serviceDuration,
        orderId,
      });

      let paymentIntent = null;

      // Only create a payment intent if the amount is greater than 0
      if (amount > 0) {
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: "usd",
        });
      }

      await newAppointment.save();

      res.status(200).json({
        message: "Appointment booked successfully",
        appointment: {
          doctorId,
          appointmentDate: formattedDate,
          startTime: formattedStartTime,
          serviceDuration,
        },
        ...(paymentIntent && { clientSecret: paymentIntent.client_secret }),
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while booking the appointment.",
      error: error.message,
    });
  }
};

module.exports.SendEmail = async (req, res) => {
  const { doctorEmail, patientEmail, meetLink } = req.body;
  // console.log("send email >> ", req.body);

  const mailOptions = {
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

module.exports.checkAppointmentAvailability = async (req, res) => {
  try {
    const { selectedServices, doctorId, selectedDate } = req.body;

    if (!selectedServices) {
      return res.status(403).send({ message: "Please select a service" });
    }

    if (!selectedDate) {
      // console.log("selectedDate >> ", selectedDate);
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

    const doctorAppointments = await AppointmentModel.find({
      doctorId,
    }).populate("selectedServices");

    if (doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No Appointments Found" });
    }

    const appointmentsWithServices = doctorAppointments.map((appointment) => {
      return {
        ...appointment._doc,
        services: appointment.selectedServices,
      };
    });

    return res
      .status(200)
      .json({ message: "success", data: appointmentsWithServices });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports.FetchPastAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log(doctorId);
    const today = new Date();

    const pastAppointments = await AppointmentModel.find({
      doctorId,
      appointmentDate: { $lt: today },
    }).populate("selectedServices");
    // console.log(pastAppointments);

    if (pastAppointments.length === 0) {
      return res.status(404).json({ message: "No Past Appointments Found" });
    }

    return res.status(200).json({ message: "success", data: pastAppointments });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
