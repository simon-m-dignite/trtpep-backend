const express = require("express");
const {
  AddDoctor,
  LoginDoctor,
  fetchAllDoctors,
  DeleteDoctor,
  ForgotPassword,
  RequestOtp,
  VerifyOtp,
  ResetPassword,
  AddTimings,
  GetDoctorTiming,
} = require("../controllers/doctorController");
const router = express.Router();

router.post("/add-doctor", AddDoctor);
router.post("/doctor-login", LoginDoctor);
router.get("/fetch-doctors", fetchAllDoctors);
router.delete("/delete-doctor/:doctorId", DeleteDoctor);
router.post("/doctor/verify-email", ForgotPassword);

//
router.post("/doctor/request-new-otp", RequestOtp);
router.post("/doctor/verify-otp", VerifyOtp);

router.post("/doctor/reset-password", ResetPassword);

router.post("/doctor/create-timing", AddTimings);

router.get("/doctor/doctor-timing/:doctorId", GetDoctorTiming);

module.exports = router;
