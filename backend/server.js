import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./connfig/db.js";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import protect from "./middleware/authMiddleware.js";
import adminOnly from "./middleware/adminMiddleware.js";

import Room from "./models/Room.js";
import Booking from "./models/Booking.js";

dotenv.config();

connectDB();

const app = express();

// Middleware

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Test route

app.get("/", (req, res) => {
  res.json({
    message:
      "Hotel Room Booking API is running successfully.",
  });
});

// API Routes

app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/bookings", bookingRoutes);

// Admin Dashboard

app.get(
  "/api/admin/dashboard",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const totalRooms =
        await Room.countDocuments();

      const availableRooms =
        await Room.countDocuments({
          status: "Available",
        });

      const bookedRoomIds =
        await Booking.distinct("room", {
          status: {
            $in: [
              "Pending",
              "Confirmed",
              "Checked-In",
            ],
          },
        });

      const bookedRooms =
        bookedRoomIds.length;

      const totalBookings =
        await Booking.countDocuments();

      res.json({
        totalRooms,
        availableRooms,
        bookedRooms,
        totalBookings,
      });
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to fetch dashboard data.",
      });
    }
  }
);

// 404 Handler

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});