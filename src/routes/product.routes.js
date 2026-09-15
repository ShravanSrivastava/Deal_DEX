const express = require("express");

const {
  getProducts,
  getProductById,
  getProductPrices,
  getProductReviews,
  analyzeProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id/prices", getProductPrices);
router.get("/:id/reviews", getProductReviews);
router.get("/:id/analyze", analyzeProduct);
router.get("/:id", getProductById);

module.exports = router;
