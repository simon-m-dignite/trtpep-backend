const express = require("express");
const {
  AddDoctor,
  LoginDoctor,
  fetchAllDoctors,
  DeleteDoctor,
} = require("../controllers/doctorController");
const router = express.Router();

router.post("/add-doctor", AddDoctor);
router.post("/doctor-login", LoginDoctor);
router.get("/fetch-doctors", fetchAllDoctors);
router.delete("/delete-doctor/:doctorId", DeleteDoctor);

module.exports = router;
