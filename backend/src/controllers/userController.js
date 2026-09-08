const User = require("../models/User");

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById
};
