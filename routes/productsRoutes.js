const express = require("express");
const {
  AddProducts,
  UpdateProductById,
  FetchProducts,
} = require("../controllers/productsController");
const router = express.Router();

router.post("/products/update-products", AddProducts);
router.put("/products/update-products/:_id", UpdateProductById);
router.get("/products/get-products", FetchProducts);

module.exports = router;
