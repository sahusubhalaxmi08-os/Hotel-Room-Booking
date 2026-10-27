function BookingCard({ booking }) {
  return (
    <div className="booking-card">
      <div>
        <h3>
          {booking.room?.roomType || "Room"} - Room{" "}
          {booking.room?.roomNumber || ""}
        </h3>

        <p>
          Check In:{" "}
          {new Date(booking.checkIn).toLocaleDateString()}
        </p>

        <p>
          Check Out:{" "}
          {new Date(booking.checkOut).toLocaleDateString()}
        </p>

        <p>Guests: {booking.guests}</p>

        <strong>Total: ₹{booking.totalAmount}</strong>
      </div>

      <div>
        <span className={`status ${booking.status?.toLowerCase()}`}>
          {booking.status}
        </span>
      </div>
    </div>
  );
}

export default BookingCard;