const express = require("express");
const { BookAppointment } = require("../controllers/appointmentController");
const router = express.Router();

router.post("/book-appointment", BookAppointment);

module.exports = router;
