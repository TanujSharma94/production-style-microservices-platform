const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deactivateProduct
} = require("../controllers/productController");

const {
  createProductValidator,
  updateProductValidator
} = require("../validators/productValidator");

const validationMiddleware = require("../middleware/validationMiddleware");

const authMiddleware = require("../middleware/auth/authMiddleware");
const roleMiddleware = require("../middleware/auth/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),	
  createProductValidator,
  validationMiddleware,
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateProductValidator,
  validationMiddleware,
  updateProduct
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("admin"),
  deactivateProduct
);

module.exports = router;
