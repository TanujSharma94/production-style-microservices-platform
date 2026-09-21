const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory
} = require("../controllers/categoryController");

const {
  createCategoryValidator,
  updateCategoryValidator
} = require("../validators/categoryValidator");

const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/auth/authMiddleware");
const roleMiddleware = require("../middleware/auth/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createCategoryValidator,
  validationMiddleware,
  createCategory
);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCategoryValidator,
  validationMiddleware,
  updateCategory
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("admin"),
  deactivateCategory
);

module.exports = router;
