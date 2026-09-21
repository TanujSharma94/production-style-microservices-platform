const express = require("express");

const {
  login
} = require("../../controllers/auth/authController");

const {
  loginValidator
} = require("../../validators/userValidator");

const validationMiddleware = require("../../middleware/validationMiddleware");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const roleMiddleware = require("../../middleware/auth/roleMiddleware");

const router = express.Router();

router.post(
  "/login",
  loginValidator,
  validationMiddleware,
  login
);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    data: {
      user: req.user
    }
  });
});

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      data: {
        user: req.user
      }
    });
  }
);

module.exports = router;
