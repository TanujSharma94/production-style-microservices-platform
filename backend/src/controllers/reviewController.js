const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");

const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive"
      });
    }

    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment
    });

    const populated = await review.populate("user", "name");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(200).json({
        success: true,
        data: { reviews: [], average: 0, count: 0 }
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const count = reviews.length;
    const average = count
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

    res.status(200).json({
      success: true,
      data: { reviews, average, count }
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    const isOwner = String(review.user) === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review"
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview
};
