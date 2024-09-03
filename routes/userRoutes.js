const express = require("express");
const {
  CreateUser,
  LoginUser,
  ForgotPassword,
  RequestOtp,
  VerifyOtp,
  ResetPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/auth/register", CreateUser);
router.post("/auth/login", LoginUser);
router.post("/auth/verify-email", ForgotPassword);

//
router.post("/auth/request-new-otp", RequestOtp);
router.post("/auth/verify-otp", VerifyOtp);

router.post("/auth/reset-password", ResetPassword);

module.exports = router;
