const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./core/utils/middleware");
const filesRouter = require("./routes/filesRouter");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// Routes
app.use("/", filesRouter);

// Error handling
app.use(middleware.unknownEndpoint);

module.exports = app;
