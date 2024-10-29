const express = require("express");
const {
  saveTimeSlots,
  FetchDoctorSlotsById,
  getTimeSlots,
} = require("../controllers/doctorTimeSlotController");
const router = express.Router();

router.post("/doctor/saveTimeSlots", saveTimeSlots);
router.post("/doctor/test", getTimeSlots);

router.get("/doctor/doctor-slots/:doctorId", FetchDoctorSlotsById);

module.exports = router;
