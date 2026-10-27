import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ManageRooms() {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");

      setRooms(response.data.rooms || response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) {
      return;
    }

    try {
      await api.delete(`/rooms/${id}`);

      alert("Room deleted.");

      fetchRooms();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to delete room."
      );
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Manage Rooms</h1>

        <Link to="/admin/add-room" className="primary-btn">
          + Add Room
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td>{room.roomNumber}</td>
                <td>{room.roomType}</td>
                <td>₹{room.price}</td>
                <td>{room.capacity}</td>
                <td>{room.status}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteRoom(room._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageRooms;