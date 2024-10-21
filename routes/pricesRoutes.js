const express = require("express");
const {
  CreateDeliveryCharges,
  UpdateDeliveryCharges,
  GetPrices,
} = require("../controllers/pricesController");
const router = express.Router();

router.post("/prices/set-delivery-charges", CreateDeliveryCharges);
router.put("/prices/update-delivery-charges", UpdateDeliveryCharges);
router.get("/prices/get-prices", GetPrices);

module.exports = router;
