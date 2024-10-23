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
  NewPatient,
  UpdateNewPatientStatus,
  FetchPatientInfoByEmail,
} = require("../controllers/patientController");
const router = express.Router();
const cors = require("cors");

var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
  optionsSuccessStatus: 200,
};

router.get("/get-patients", FetchPatients);
router.get("/get-patient/:id", FetchPatient);
router.post("/enroll-patient", EnrollPatient);
router.get("/get-enrolled-patients", FetchEnrolledPatients);
router.get("/get-enrolled-patient/:email", GetEnrolledPatient);

router.post("/search-patient", SearchPatient);

router.put("/update-order-status/:patientId", UpdateorderStatus);

router.get("/filter-patients", FilterPatients);

router.post("/new-patient", cors(corsOptions), NewPatient);

router.put("/patient/update-status", UpdateNewPatientStatus);

router.get("/patient/patient-info/:email", FetchPatientInfoByEmail);

module.exports = router;
