const express = require("express");

const {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProductById,
  updateProduct,
  deactivateProduct,
  activateProduct
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

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllProductsAdmin
);

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

router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware("admin"),
  activateProduct
);

module.exports = router;
