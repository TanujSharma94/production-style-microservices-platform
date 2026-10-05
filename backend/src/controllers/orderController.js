const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { reserveInventory, releaseInventory, sellInventory } = require("../services/inventory/inventoryService");

const checkoutOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    let order;

    try {
      await session.withTransaction(async () => {
        for (const item of cart.items) {
          await reserveInventory(item.product, item.quantity, session);
        }

        const totalAmount = cart.items.reduce(
          (sum, item) => sum + item.priceAtAdd * item.quantity,
          0
        );

        const orderItems = cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          priceAtOrder: item.priceAtAdd
        }));

        const createdOrders = await Order.create(
          [
            {
              user: userId,
              items: orderItems,
              totalAmount,
              status: "pending",
              paymentStatus: "unpaid"
            }
          ],
          { session }
        );

        order = createdOrders[0];

        cart.items = [];
        await cart.save({ session });
      });
    } catch (transactionError) {
      throw transactionError;
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    if (error.message === "Insufficient inventory") {
      return res.status(409).json({
        success: false,
        message: "Insufficient inventory for one or more items in your cart"
      });
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId }).populate(
      "items.product",
      "name isActive"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name isActive");

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("items.product", "name isActive")
      .populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status}`
      });
    }

    await session.withTransaction(async () => {
      for (const item of order.items) {
        await releaseInventory(item.product, item.quantity, session);
      }

      order.status = "cancelled";
      await order.save({ session });
    });

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

const markOrderPaid = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: `Order cannot be marked paid because it is ${order.status}`
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        message: "Order is already paid"
      });
    }

    await session.withTransaction(async () => {
      for (const item of order.items) {
        await sellInventory(item.product, item.quantity, session);
      }

      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save({ session });
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as paid",
      data: order
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  checkoutOrder,
  getOrderById,
  getMyOrders,
  getAllOrdersAdmin,
  cancelOrder,
  markOrderPaid
};
