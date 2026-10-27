import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

// GET ALL ROOMS
export const getRooms = async (req, res) => {
  try {
    const {
      roomType,
      guests,
      checkIn,
      checkOut,
    } = req.query;

    const filter = {};

    if (roomType) {
      filter.roomType = roomType;
    }

    if (guests) {
      filter.capacity = {
        $gte: Number(guests),
      };
    }

    filter.status = "Available";

    let rooms = await Room.find(filter).sort({
      roomNumber: 1,
    });

    // Check date availability
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      if (endDate <= startDate) {
        return res.status(400).json({
          message:
            "Check-out date must be after check-in date.",
        });
      }

      const conflictingBookings =
        await Booking.find({
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
        }).select("room");

      const bookedRoomIds =
        conflictingBookings.map(
          (booking) => booking.room.toString()
        );

      rooms = rooms.filter(
        (room) =>
          !bookedRoomIds.includes(
            room._id.toString()
          )
      );
    }

    res.json({
      rooms,
    });
  } catch (error) {
    console.error("Get Rooms Error:", error);

    res.status(500).json({
      message: "Unable to fetch rooms.",
    });
  }
};

// GET SINGLE ROOM
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    res.json({
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch room.",
    });
  }
};

// ADD ROOM
export const addRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      roomType,
      price,
      capacity,
      description,
      amenities,
      image,
    } = req.body;

    if (
      !roomNumber ||
      !roomType ||
      price === undefined ||
      !capacity
    ) {
      return res.status(400).json({
        message: "Required room fields are missing.",
      });
    }

    const existingRoom =
      await Room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists.",
      });
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      price,
      capacity,
      description,
      amenities,
      image,
    });

    res.status(201).json({
      message: "Room added successfully.",
      room,
    });
  } catch (error) {
    console.error("Add Room Error:", error);

    res.status(500).json({
      message: "Unable to add room.",
    });
  }
};

// UPDATE ROOM
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    res.json({
      message: "Room updated successfully.",
      room,
    });
  } catch (error) {
    console.error("Update Room Error:", error);

    res.status(500).json({
      message: "Unable to update room.",
    });
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    const activeBooking = await Booking.findOne({
      room: room._id,
      status: {
        $in: [
          "Pending",
          "Confirmed",
          "Checked-In",
        ],
      },
    });

    if (activeBooking) {
      return res.status(400).json({
        message:
          "Cannot delete a room with an active booking.",
      });
    }

    await room.deleteOne();

    res.json({
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Room Error:", error);

    res.status(500).json({
      message: "Unable to delete room.",
    });
  }
};