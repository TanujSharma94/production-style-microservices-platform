const {
  reserveInventory,
  releaseInventory,
  sellInventory,
  restockInventory
} = require("../../services/inventory/inventoryService");

const reserve = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const inventory = await reserveInventory(
      req.params.productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Inventory reserved successfully",
      data: inventory
    });
  } catch (error) {
    if (error.message === "Insufficient inventory") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Quantity must be a positive integer") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const release = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const inventory = await releaseInventory(
      req.params.productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Inventory released successfully",
      data: inventory
    });
  } catch (error) {
    if (error.message === "Insufficient reserved inventory") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Quantity must be a positive integer") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const sell = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const inventory = await sellInventory(
      req.params.productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Inventory sold successfully",
      data: inventory
    });
  } catch (error) {
    if (error.message === "Insufficient reserved inventory") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Quantity must be a positive integer") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const restock = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const inventory = await restockInventory(
      req.params.productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Inventory restocked successfully",
      data: inventory
    });
  } catch (error) {
    if (error.message === "Quantity must be a positive integer") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Inventory not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

module.exports = {
  reserve,
  release,
  sell,
  restock
};
