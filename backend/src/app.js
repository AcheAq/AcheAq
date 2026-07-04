const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/route");
const authRoutes = require("./routes/authRoute");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use(routes);
app.use("/auth", authRoutes);

module.exports = app;
