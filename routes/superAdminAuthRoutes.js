const express = require("express");
const {
  CreateUser,
  LoginUser,
  ForgotPassword,
  RequestOtp,
  VerifyOtp,
  ResetPassword,
} = require("../controllers/superAdminAuthController");
// const {
//   CreateUser,
//   LoginUser,
//   ForgotPassword,
//   RequestOtp,
//   VerifyOtp,
//   ResetPassword,
// } = require("../controllers/authController");
const router = express.Router();

router.post("/super-admin/register", CreateUser);
router.post("/super-admin/login", LoginUser);
router.post("/super-admin/verify-email", ForgotPassword);

//
router.post("/super-admin/request-new-otp", RequestOtp);
router.post("/super-admin/verify-otp", VerifyOtp);

router.post("/super-admin/reset-password", ResetPassword);

module.exports = router;
