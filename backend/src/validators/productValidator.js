const { body } = require("express-validator");

const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Product description must be between 10 and 5000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a non-negative number"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required")
    .bail()
    .isMongoId()
    .withMessage("Product category must be a valid category ID"),

  body("initialStock")
    .notEmpty()
    .withMessage("Initial stock is required")
    .isInt({ min: 0 })
    .withMessage("Initial stock must be a non-negative integer")
];

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Product description must be between 10 and 5000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a non-negative number"),

  body("category")
    .optional()
    .trim()
    .isMongoId()
    .withMessage("Product category must be a valid category ID")
];

module.exports = {
  createProductValidator,
  updateProductValidator
};
