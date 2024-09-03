const express = require("express");
const {
  FetchLabOrders,
  FetchLabOrder,
  UpdateLabOrderStatus,
  FilterLabOrders,
} = require("../controllers/labOrderController");
const router = express.Router();

router.get("/get-lab-orders", FetchLabOrders);
router.get("/get-lab-order/:id", FetchLabOrder);

router.put("/lab-order-status/:orderId", UpdateLabOrderStatus);

router.get("/filter-lab-orders", FilterLabOrders);

module.exports = router;
