const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    reservedQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    soldQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    lowStockThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
