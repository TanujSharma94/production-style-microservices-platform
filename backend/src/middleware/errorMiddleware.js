const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already exists"
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
