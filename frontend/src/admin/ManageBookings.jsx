import { useEffect, useState } from "react";
import api from "../services/api";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/all");

      setBookings(response.data.bookings || response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBooking = async (id, action) => {
    try {
      await api.put(`/bookings/${id}/${action}`);

      alert(`Booking ${action} successful.`);

      fetchBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update booking."
      );
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Bookings</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.user?.name}</td>

                <td>
                  {booking.room?.roomNumber}
                </td>

                <td>
                  {new Date(
                    booking.checkIn
                  ).toLocaleDateString()}
                </td>

                <td>
                  {new Date(
                    booking.checkOut
                  ).toLocaleDateString()}
                </td>

                <td>₹{booking.totalAmount}</td>

                <td>{booking.status}</td>

                <td className="action-buttons">
                  {booking.status === "Pending" && (
                    <button
                      onClick={() =>
                        updateBooking(
                          booking._id,
                          "confirm"
                        )
                      }
                    >
                      Confirm
                    </button>
                  )}

                  {booking.status === "Confirmed" && (
                    <button
                      onClick={() =>
                        updateBooking(
                          booking._id,
                          "checkin"
                        )
                      }
                    >
                      Check-In
                    </button>
                  )}

                  {booking.status === "Checked-In" && (
                    <button
                      onClick={() =>
                        updateBooking(
                          booking._id,
                          "checkout"
                        )
                      }
                    >
                      Check-Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBookings;