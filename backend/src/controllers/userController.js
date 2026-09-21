const User = require("../models/User");
const { hashPassword } = require("../services/authService");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await hashPassword(password);
	  
    const user = await User.create({
      name,
      email,
      password: hashedPassword	    
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
	id: user._id,
        name: user.name,
	email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });	    
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

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
    const user = await User.findById(req.params.id).select("-password");

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
