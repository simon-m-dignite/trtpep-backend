const express = require("express");
const {
  CreateDeliveryCharges,
  UpdateDeliveryCharges,
  GetPrices,
  GetChargesById,
} = require("../controllers/pricesController");
const router = express.Router();

router.post("/prices/set-charges", CreateDeliveryCharges);
router.put("/charges/update-charges/:_id", UpdateDeliveryCharges);
router.get("/charges/get-charges", GetPrices);
router.get("/charges/get-charges/:_id", GetChargesById);
// router.get("/prices/price/:_id");

module.exports = router;
