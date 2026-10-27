import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);

        setRoom(response.data.room || response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateDays = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);

    const difference = end - start;

    return Math.max(
      0,
      Math.ceil(difference / (1000 * 60 * 60 * 24))
    );
  };

  const totalAmount = calculateDays() * (room?.price || 0);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    try {
      await api.post("/bookings", {
        room: id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests),
      });

      alert("Booking created successfully!");

      navigate("/my-bookings");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Booking failed. Please try again."
      );
    }
  };

  if (!room) {
    return <h2 className="center">Loading...</h2>;
  }

  return (
    <div className="booking-page">
      <div className="booking-form-container">
        <h1>Book Your Room</h1>

        <form onSubmit={handleBooking}>
          <label>Check-In Date</label>

          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            required
          />

          <label>Check-Out Date</label>

          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            required
          />

          <label>Number of Guests</label>

          <input
            type="number"
            name="guests"
            min="1"
            max={room.capacity}
            value={formData.guests}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Confirm Booking
          </button>
        </form>
      </div>

      <div className="booking-summary">
        <h2>Booking Summary</h2>

        <h3>{room.roomType}</h3>

        <p>Room Number: {room.roomNumber}</p>

        <p>Price: ₹{room.price}/night</p>

        <p>Nights: {calculateDays()}</p>

        <hr />

        <h2>Total: ₹{totalAmount}</h2>
      </div>
    </div>
  );
}

export default Booking;