const Inventory = require("../../models/Inventory");

const reserveInventory = async (productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const inventory = await Inventory.findOneAndUpdate(
    {
      product: productId,
      availableQuantity: { $gte: quantity }
    },
    {
      $inc: {
        availableQuantity: -quantity,
        reservedQuantity: quantity
      }
    },
    {
      new: true
    }
  );

  if (!inventory) {
    throw new Error("Insufficient inventory");
  }

  return inventory;
};

const releaseInventory = async (productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const inventory = await Inventory.findOneAndUpdate(
    {
      product: productId,
      reservedQuantity: { $gte: quantity }
    },
    {
      $inc: {
        reservedQuantity: -quantity,
        availableQuantity: quantity
      }
    },
    {
      new: true
    }
  );

  if (!inventory) {
    throw new Error("Insufficient reserved inventory");
  }

  return inventory;
};

const sellInventory = async (productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const inventory = await Inventory.findOneAndUpdate(
    {
      product: productId,
      reservedQuantity: { $gte: quantity }
    },
    {
      $inc: {
        reservedQuantity: -quantity,
        soldQuantity: quantity
      }
    },
    {
      new: true
    }
  );

  if (!inventory) {
    throw new Error("Insufficient reserved inventory");
  }

  return inventory;
};

const restockInventory = async (productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const inventory = await Inventory.findOneAndUpdate(
    {
      product: productId
    },
    {
      $inc: {
        availableQuantity: quantity
      }
    },
    {
      new: true
    }
  );

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  return inventory;
};

module.exports = {
  reserveInventory,
  releaseInventory,
  sellInventory,
  restockInventory
};
