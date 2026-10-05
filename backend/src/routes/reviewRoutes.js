const express = require("express");

const {
  createReview,
  getProductReviews,
  deleteReview
} = require("../controllers/reviewController");
const { createReviewValidator } = require("../validators/reviewValidator");
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/auth/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createReviewValidator,
  validationMiddleware,
  createReview
);

router.get("/product/:productId", getProductReviews);

router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
