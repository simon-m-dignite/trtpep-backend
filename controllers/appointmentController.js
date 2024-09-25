const mongoose = require("mongoose");
const AppointmentModel = mongoose.model("Appointments");

module.exports.BookAppointment = async (req, res) => {
  try {
    const {
      selectedServices,
      selectedDate,
      selectedTime,
      patientFirstName,
      patientLastName,
      patientEmail,
      patientPhoneNumber,
      accountNumber,
    } = req.body;

    console.log("appointment api >> ", req.body);

    await AppointmentModel.create({
      selectedServices,
      selectedDate,
      selectedTime,
      patientFirstName,
      patientLastName,
      patientEmail,
      patientPhoneNumber,
      accountNumber,
    });

    res.status(200).send({ mesage: "Appointment Booked Successfully!" });
  } catch (error) {
    console.log("BookAppointment error >> ", error);
    res.status(500).send({ message: "Something went wrong", error });
  }
};
