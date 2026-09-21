const express = require("express");

const {
  reserve,
  release,
  sell,
  restock
} = require("../controllers/inventory/inventoryController");

const {
  inventoryQuantityValidator
} = require("../validators/inventoryValidator");

const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/auth/authMiddleware");
const roleMiddleware = require("../middleware/auth/roleMiddleware");

const router = express.Router();

router.post(
  "/:productId/reserve",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryQuantityValidator,
  validationMiddleware,
  reserve
);

router.post(
  "/:productId/release",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryQuantityValidator,
  validationMiddleware,
  release
);

router.post(
  "/:productId/sell",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryQuantityValidator,
  validationMiddleware,
  sell
);

router.post(
  "/:productId/restock",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryQuantityValidator,
  validationMiddleware,
  restock
);

module.exports = router;
