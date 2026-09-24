const express = require("express");

const { addToCart, getCart, updateCartItem, removeCartItem } = require("../controllers/cartController");
const { addToCartValidator, updateCartItemValidator } = require("../validators/cartValidator");
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/auth/authMiddleware");

const router = express.Router();

router.post(
  "/items",
  authMiddleware,
  addToCartValidator,
  validationMiddleware,
  addToCart
);

router.get("/", authMiddleware, getCart);

router.put(
  "/items/:productId",
  authMiddleware,
  updateCartItemValidator,
  validationMiddleware,
  updateCartItem
);

router.delete("/items/:productId", authMiddleware, removeCartItem);

module.exports = router;
