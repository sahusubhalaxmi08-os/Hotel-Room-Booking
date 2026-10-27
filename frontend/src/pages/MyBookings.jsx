import { useEffect, useState } from "react";
import api from "../services/api";
import BookingCard from "../components/BookingCard";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my");

      setBookings(response.data.bookings || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await api.put(`/bookings/${id}/cancel`);

      alert("Booking cancelled.");

      fetchBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    }
  };

  return (
    <div className="page-container">
      <h1>My Bookings</h1>

      {loading ? (
        <h3>Loading...</h3>
      ) : bookings.length === 0 ? (
        <div className="empty">
          <h3>No bookings found</h3>
          <p>You haven't booked any rooms yet.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking._id}>
              <BookingCard booking={booking} />

              {booking.status !== "Cancelled" &&
                booking.status !== "Checked-Out" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;