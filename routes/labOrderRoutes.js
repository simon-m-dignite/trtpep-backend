const express = require("express");
const {
  FetchLabOrders,
  FetchLabOrder,
  UpdateLabOrderStatus,
  FilterLabOrders,
  PlaceLabOrder,
} = require("../controllers/labOrderController");
const router = express.Router();
const cors = require("cors");

var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
  optionsSuccessStatus: 200,
};

router.get("/get-lab-orders", FetchLabOrders);
router.get("/get-lab-order/:id", FetchLabOrder);

router.put("/lab-order-status/:orderId", UpdateLabOrderStatus);

router.get("/filter-lab-orders", FilterLabOrders);

router.post("/create-payment-intent", cors(corsOptions), PlaceLabOrder);

module.exports = router;
