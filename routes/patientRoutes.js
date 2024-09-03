const express = require("express");
const {
  FetchPatients,
  FetchPatient,
  EnrollPatient,
  FetchEnrolledPatients,
  GetEnrolledPatient,
  SearchPatient,
  UpdateorderStatus,
  FilterPatients,
} = require("../controllers/patientController");
const router = express.Router();

router.get("/get-patients", FetchPatients);
router.get("/get-patient/:id", FetchPatient);
router.post("/enroll-patient", EnrollPatient);
router.get("/get-enrolled-patients", FetchEnrolledPatients);
router.post("/get-enrolled-patient", GetEnrolledPatient);

router.post("/search-patient", SearchPatient);

router.put("/update-order-status/:patientId", UpdateorderStatus);

router.get("/filter-patients", FilterPatients);

module.exports = router;
