import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function RoomDetails() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);

        setRoom(response.data.room || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return <h2 className="center">Loading...</h2>;
  }

  if (!room) {
    return <h2 className="center">Room not found</h2>;
  }

  return (
    <div className="room-details">
      <img
        src={
          room.image ||
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a"
        }
        alt={room.roomType}
      />

      <div className="room-details-info">
        <span className="room-type">{room.roomType}</span>

        <h1>Room {room.roomNumber}</h1>

        <p>{room.description}</p>

        <h2>₹{room.price} / night</h2>

        <p>👥 Maximum Guests: {room.capacity}</p>

        <h3>Amenities</h3>

        <div className="amenities">
          {room.amenities?.map((item, index) => (
            <span key={index}>✓ {item}</span>
          ))}
        </div>

        <Link to={`/booking/${room._id}`} className="book-btn">
          Book This Room
        </Link>
      </div>
    </div>
  );
}

export default RoomDetails;