import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <div className="room-card">
      <img
        src={
          room.image ||
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a"
        }
        alt={room.roomType}
      />

      <div className="room-card-content">
        <span className="room-type">{room.roomType}</span>

        <h3>Room {room.roomNumber}</h3>

        <p>{room.description || "Comfortable and luxurious hotel room."}</p>

        <div className="room-info">
          <span>👥 {room.capacity || 2} Guests</span>
          <span>₹{room.price}/night</span>
        </div>

        <Link to={`/rooms/${room._id}`} className="book-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;