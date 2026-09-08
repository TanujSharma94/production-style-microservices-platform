const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

module.exports = app;
