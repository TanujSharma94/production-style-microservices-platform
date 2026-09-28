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
const authMiddleware = require("../middleware/auth/authMiddleware");
const roleMiddleware = require("../middleware/auth/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  createUserValidator,
  validationMiddleware,
  createUser
);

router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);

router.get("/:id", authMiddleware, roleMiddleware("admin"), getUserById);

module.exports = router;
