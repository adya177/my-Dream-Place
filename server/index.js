import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { connectToDb } from "./src/config/db.js";
import authRoutes from "./src/routes/User.js";
import postRoutes from "./src/routes/Post.js";
import categoryRoutes from "./src/routes/Category.js";
import bookingRoutes from "./src/routes/Booking.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true }));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.get("/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use((req, res, next) => {
  const isPaymentIntent = req.path === "/api/booking/create-payment-intent";
  if (isPaymentIntent || mongoose.connection.readyState === 1) {
    return next();
  }
  return res.status(503).json({
    success: false,
    message: "Database is unavailable. Check the server MongoDB connection.",
  });
});

// Routes
app.use("/auth/api", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/booking", bookingRoutes);

const PORT = process.env.PORT || 3000;

const connectWithRetry = async () => {
  try {
    await connectToDb();
  } catch (error) {
    console.error(`MongoDB is not ready: ${error.message}`);
    const retryTimer = setTimeout(connectWithRetry, 10000);
    retryTimer.unref();
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectWithRetry();
});
