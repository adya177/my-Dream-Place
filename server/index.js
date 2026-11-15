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
import { getHotelSuggestionsController, searchHotelsController } from "./src/controller/Post.js";

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
app.get("/api/hotels", searchHotelsController);
app.get("/api/hotels/suggestions", getHotelSuggestionsController);

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

app.use((req, res) => {
  res.status(404).json({ success: false, message: "The requested route was not found." });
});

// Centralized Express error response for malformed requests and errors passed to next().
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const statusCode = Number(error?.status || error?.statusCode);
  const status = Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  if (status >= 500) console.error("Unhandled request error:", error?.message || "Unknown error");
  return res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal Server Error" : (error?.message || "Request failed."),
  });
});

const PORT = process.env.PORT || 3000;

const connectWithRetry = async () => {
  try {
    await connectToDb();
  } catch (error) {
    console.error(`MongoDB connection is not ready: ${error.message}`);
    const retryTimer = setTimeout(connectWithRetry, 10000);
    retryTimer.unref();
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectWithRetry();
});
