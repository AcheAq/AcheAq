const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./lib/swagger");

const routes = require("./routes/route");
const authRoutes = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const itemRoute = require("./routes/itemRoute");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// Serve as imagens enviadas (multer salva em backend/uploads/).
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(routes);
app.use("/auth", authRoutes);
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/item", itemRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

module.exports = app;
