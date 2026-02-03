const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const errorHandler = require("./middleware/errorMiddleware");

// Middleware
// Allow both localhost (for development) and deployed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL, // You'll set this when deploying
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or same-origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

// Base API route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "IMS Backend API is running",
  });
});

// Error Middleware (Must be the last app.use)
app.use(errorHandler); //

module.exports = app;