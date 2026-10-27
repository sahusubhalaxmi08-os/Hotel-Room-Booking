import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import RoomCard from "../components/RoomCard";
import SearchBar from "../components/SearchBar";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const fetchRooms = async (searchData = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      Object.entries(searchData).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await api.get(`/rooms?${params.toString()}`);

      setRooms(response.data.rooms || response.data);
    } catch (error) {
      console.error(error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchData = {
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      guests: searchParams.get("guests") || "",
      roomType: searchParams.get("roomType") || "",
    };

    fetchRooms(searchData);
  }, []);

  return (
    <div className="page-container">
      <h1>Available Rooms</h1>

      <SearchBar onSearch={fetchRooms} />

      {loading ? (
        <h3>Loading rooms...</h3>
      ) : rooms.length === 0 ? (
        <div className="empty">
          <h3>No rooms available</h3>
          <p>Try changing your search criteria.</p>
        </div>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;