const express = require("express");
const {
  BookAppointment,
  SendEmail,
  checkAppointmentAvailability,
  FetchDoctorAppointment,
} = require("../controllers/appointmentController");
const router = express.Router();

router.post("/book-appointment", BookAppointment);
router.post("/send-email", SendEmail);
router.post("/appointments/check-availability", checkAppointmentAvailability);

router.get("/appointments/get-appointments/:doctorId", FetchDoctorAppointment);

module.exports = router;
