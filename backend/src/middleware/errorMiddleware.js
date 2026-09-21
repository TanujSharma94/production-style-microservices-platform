const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0];

    let message = "Duplicate value already exists";

    if (duplicateField === "email") {
      message = "Email already exists";
    } else if (duplicateField === "name") {
      message = "Category name already exists";
    }

    return res.status(409).json({
      success: false,
      message
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message
    }));

    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};

module.exports = errorMiddleware;
