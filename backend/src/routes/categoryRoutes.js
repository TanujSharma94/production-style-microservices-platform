const express = require("express");

const {
  createCategory,
  getCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  updateCategory,
  deactivateCategory,
  activateCategory
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

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllCategoriesAdmin
);

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

router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware("admin"),
  activateCategory
);

module.exports = router;
