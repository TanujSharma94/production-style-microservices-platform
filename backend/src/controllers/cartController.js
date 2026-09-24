const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Cart = require("../models/Cart");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive"
      });
    }

    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory || inventory.availableQuantity < quantity) {
      return res.status(409).json({
        success: false,
        message: "Insufficient inventory for requested quantity"
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (inventory.availableQuantity < newQuantity) {
        return res.status(409).json({
          success: false,
          message: "Insufficient inventory for updated quantity"
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.priceAtAdd = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtAdd: product.price
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name isActive"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { user: userId, items: [] }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory || inventory.availableQuantity < quantity) {
      return res.status(409).json({
        success: false,
        message: "Insufficient inventory for requested quantity"
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemExists = cart.items.some(
      (i) => i.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem };
