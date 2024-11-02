const express = require("express");
const {
  BookAppointment,
  SendEmail,
  checkAppointmentAvailability,
  FetchDoctorAppointment,
  GetSlots,
  FetchPastAppointments,
} = require("../controllers/appointmentController");
const router = express.Router();

router.post("/book-appointment", BookAppointment);

router.post("/send-email", SendEmail);

router.post("/appointments/check-availability", checkAppointmentAvailability);

router.get("/appointments/get-appointments/:doctorId", FetchDoctorAppointment);

router.post("/doctor-slots", GetSlots);

router.get("/appointments/past-appointments/:doctorId", FetchPastAppointments);

module.exports = router;
