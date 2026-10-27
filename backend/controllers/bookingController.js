import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const {
      room,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    if (!room || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "All booking fields are required.",
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        message: "Invalid booking dates.",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        message:
          "Check-out date must be after check-in date.",
      });
    }

    const roomData = await Room.findById(room);

    if (!roomData) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    if (roomData.status !== "Available") {
      return res.status(400).json({
        message: "Room is not available.",
      });
    }

    if (Number(guests) > roomData.capacity) {
      return res.status(400).json({
        message: `This room can accommodate maximum ${roomData.capacity} guests.`,
      });
    }

    // Check overlapping bookings
    const existingBooking =
      await Booking.findOne({
        room,

        status: {
          $in: [
            "Pending",
            "Confirmed",
            "Checked-In",
          ],
        },

        checkIn: {
          $lt: endDate,
        },

        checkOut: {
          $gt: startDate,
        },
      });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "Room is already booked for these dates.",
      });
    }

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (endDate - startDate) /
        millisecondsPerDay
    );

    const totalAmount =
      nights * roomData.price;

    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests),
      totalAmount,
      status: "Pending",
      paymentStatus: "Pending",
    });

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("room")
        .populate("user", "name email phone");

    res.status(201).json({
      message: "Booking created successfully.",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      message: "Unable to create booking.",
    });
  }
};

// GET MY BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("room")
      .sort({
        createdAt: -1,
      });

    res.json({
      bookings,
    });
  } catch (error) {
    console.error("My Bookings Error:", error);

    res.status(500).json({
      message: "Unable to fetch bookings.",
    });
  }
};

// GET ALL BOOKINGS - ADMIN
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        "user",
        "name email phone"
      )
      .populate("room")
      .sort({
        createdAt: -1,
      });

    res.json({
      bookings,
    });
  } catch (error) {
    console.error("All Bookings Error:", error);

    res.status(500).json({
      message: "Unable to fetch bookings.",
    });
  }
};

// CONFIRM BOOKING
export const confirmBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        message:
          "Only pending bookings can be confirmed.",
      });
    }

    booking.status = "Confirmed";

    await booking.save();

    res.json({
      message: "Booking confirmed.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to confirm booking.",
    });
  }
};

// CHECK-IN
export const checkInBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        message:
          "Only confirmed bookings can be checked in.",
      });
    }

    booking.status = "Checked-In";

    await booking.save();

    res.json({
      message: "Guest checked in successfully.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to check in guest.",
    });
  }
};

// CHECK-OUT
export const checkOutBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Checked-In") {
      return res.status(400).json({
        message:
          "Only checked-in guests can be checked out.",
      });
    }

    booking.status = "Checked-Out";

    await booking.save();

    res.json({
      message: "Guest checked out successfully.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to check out guest.",
    });
  }
};

// CANCEL BOOKING
export const cancelBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can cancel only your own booking.",
      });
    }

    if (
      ["Checked-In", "Checked-Out"].includes(
        booking.status
      )
    ) {
      return res.status(400).json({
        message:
          "This booking cannot be cancelled.",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    res.json({
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      message: "Unable to cancel booking.",
    });
  }
};