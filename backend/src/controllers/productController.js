const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Inventory = require("../models/Inventory");

const createProduct = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { name, description, price, category, initialStock } = req.body;

    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true
    }).session(session);

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist or is inactive"
      });
    }

    let product;
    // let inventory;	  

    await session.withTransaction(async () => {
      const createdProducts = await Product.create(
        [
          {
            name,
            description,
            price,
            category
          }
        ],
        { session }
      );

      product = createdProducts[0];

      const createdInventories = await Inventory.create(
        [
          {
            product: product._id,
            availableQuantity: initialStock,
            reservedQuantity: 0,
            soldQuantity: 0,
            lowStockThreshold: 10
          }
        ],
        { session }
      );

      // inventory = createdInventories[0];
    });	    
	    

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }	  
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true
    })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    const productIds = products.map((product) => product._id);

    const inventories = await Inventory.find({
      product: { $in: productIds }
    })
      .select("product availableQuantity reservedQuantity soldQuantity")
      .lean();

    const inventoryMap = new Map(
      inventories.map((inventory) => [
        String(inventory.product),
        inventory
      ])
    );

    const data = products.map((product) => {
      const inventory = inventoryMap.get(String(product._id));

      return {
        ...product,
        stock: inventory ? inventory.availableQuantity : 0
      };
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    })
      .populate("category", "name")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const inventory = await Inventory.findOne({
      product: product._id
    })
      .select("availableQuantity reservedQuantity soldQuantity")
      .lean();

    const data = {
      ...product,
      stock: inventory ? inventory.availableQuantity : 0
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;

    if (category !== undefined) {
      const categoryExists = await Category.findOne({
        _id: category,
        isActive: true
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category does not exist or is inactive"
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(category !== undefined && { category })
      },
      {
        new: true,
        runValidators: true
      }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const deactivateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      },
      {
        new: true
      }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deactivateProduct
};
