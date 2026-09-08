const express = require("express");

const {
  createUser,
  getUsers,
  getUserById
} = require("../controllers/userController");

const {
  createUserValidator
} = require("../validators/userValidator");

const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/",
  createUserValidator,
  validationMiddleware,
  createUser
);

router.get("/", getUsers);

router.get("/:id", getUserById);

module.exports = router;
