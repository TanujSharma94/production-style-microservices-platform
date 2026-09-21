require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

const initializeInventory = async () => {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true
    }).select("_id name");

    let createdCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      const existingInventory = await Inventory.findOne({
        product: product._id
      });

      if (existingInventory) {
        skippedCount++;
        continue;
      }

      await Inventory.create({
        product: product._id,
        availableQuantity: 0,
        reservedQuantity: 0,
        soldQuantity: 0,
        lowStockThreshold: 10
      });

      createdCount++;
      console.log(`Created inventory for product: ${product.name}`);
    }

    console.log("Inventory initialization completed");
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
  } catch (error) {
    console.error(`Inventory initialization failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

initializeInventory();
