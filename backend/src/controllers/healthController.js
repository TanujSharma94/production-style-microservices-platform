const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "backend-api",
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealth
};
