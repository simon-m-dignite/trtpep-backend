const express = require("express");
const {
  FetchCustomers,
  GetCustomerOrders,
  FetchCustomerInfoByEmail,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/customers/get-customers", FetchCustomers);
router.get("/customers/customer-orders/:_id", GetCustomerOrders);
router.get("/customers/customer-info/:email", FetchCustomerInfoByEmail);

module.exports = router;
