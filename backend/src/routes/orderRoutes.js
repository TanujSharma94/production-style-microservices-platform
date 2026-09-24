const express = require("express");

const { checkoutOrder, getOrderById, getMyOrders, cancelOrder, markOrderPaid } = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth/authMiddleware");
const roleMiddleware = require("../middleware/auth/roleMiddleware");

const router = express.Router();

router.post("/checkout", authMiddleware, checkoutOrder);

router.get("/", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);

router.patch("/:id/cancel", authMiddleware, cancelOrder);

router.patch("/:id/pay", authMiddleware, roleMiddleware("admin"), markOrderPaid);

module.exports = router;
