const express = require("express");
const {
  BookAppointment,
  SendEmail,
  checkAppointmentAvailability,
} = require("../controllers/appointmentController");
const router = express.Router();

router.post("/book-appointment", BookAppointment);
router.post("/send-email", SendEmail);
router.post("/appointments/check-availability", checkAppointmentAvailability);

module.exports = router;
