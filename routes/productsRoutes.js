const express = require("express");
const {
  UpdateProducts,
  UpdateProductById,
  FetchProducts,
} = require("../controllers/productsController");
const router = express.Router();

router.post("/products/update-products", UpdateProducts);
router.put("/products/update-products/:id", UpdateProductById);
router.get("/products/get-products", FetchProducts);

module.exports = router;
