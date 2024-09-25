const express = require("express");
const {
  CreateService,
  GetDoctorServices,
  GetAllServices,
  DeleteService,
  BookAppointment,
} = require("../controllers/serviceController");
const router = express.Router();

router.post("/create-service", CreateService);
router.get("/get-doctor-services/:doctorId", GetDoctorServices);
router.get("/get-services", GetAllServices);
router.delete("/delete-service/:id", DeleteService);

module.exports = router;
