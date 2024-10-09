const express = require("express");
const {
  CreateDeliveryCharges,
  UpdateDeliveryCharges,
} = require("../controllers/pricesController");
const router = express.Router();

router.post("/prices/set-delivery-charges", CreateDeliveryCharges);
router.put("/prices/update-delivery-charges:", UpdateDeliveryCharges);

module.exports = router;
