const express = require("express");
const {
  FetchCustomers,
  GetCustomerOrders,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/customers/get-customers", FetchCustomers);
router.get("/customers/customer-orders/:_id", GetCustomerOrders);

module.exports = router;
