import express from "express";

import {
  createBooking,
  getMyBookings,
  getAllBookings,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Customer

router.post(
  "/",
  protect,
  createBooking
);

router.get(
  "/my",
  protect,
  getMyBookings
);

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

// Admin

router.get(
  "/all",
  protect,
  adminOnly,
  getAllBookings
);

router.put(
  "/:id/confirm",
  protect,
  adminOnly,
  confirmBooking
);

router.put(
  "/:id/checkin",
  protect,
  adminOnly,
  checkInBooking
);

router.put(
  "/:id/checkout",
  protect,
  adminOnly,
  checkOutBooking
);

export default router;