const express = require("express");
const {
  SaveSchedulerUrl,
  GetSchedulerUrl,
  UpdateSchedulerUrl,
} = require("../controllers/SchedulerUrlController");
const router = express.Router();

router.post("/scheduler/save-link", SaveSchedulerUrl);
router.get("/scheduler/get-link", GetSchedulerUrl);
router.put("/scheduler/update-link", UpdateSchedulerUrl);

module.exports = router;
