const { body } = require("express-validator");

const inventoryQuantityValidator = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
];

module.exports = {
  inventoryQuantityValidator
};
