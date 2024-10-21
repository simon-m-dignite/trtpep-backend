const express = require("express");
const {
  CreatePolicy,
  GetPrivacyPolicy,
  UpdatePolicy,
} = require("../controllers/privacyPolicyController");
const router = express.Router();

router.post("/policy/create-policy", CreatePolicy);
router.get("/policy/get-policy/:type", GetPrivacyPolicy);
router.put("/policy/update-policy/:type", UpdatePolicy);

module.exports = router;
