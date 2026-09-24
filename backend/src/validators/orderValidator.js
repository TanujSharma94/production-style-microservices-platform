const { param } = require("express-validator");

const orderIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ObjectId")
];

module.exports = { orderIdValidator };
