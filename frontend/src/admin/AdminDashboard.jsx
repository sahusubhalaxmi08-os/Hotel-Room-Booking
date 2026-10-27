import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Rooms</h3>
          <strong>{stats.totalRooms}</strong>
        </div>

        <div className="stat-card">
          <h3>Available Rooms</h3>
          <strong>{stats.availableRooms}</strong>
        </div>

        <div className="stat-card">
          <h3>Booked Rooms</h3>
          <strong>{stats.bookedRooms}</strong>
        </div>

        <div className="stat-card">
          <h3>Total Bookings</h3>
          <strong>{stats.totalBookings}</strong>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/add-room">➕ Add Room</Link>
        <Link to="/admin/rooms">🏨 Manage Rooms</Link>
        <Link to="/admin/bookings">📋 Manage Bookings</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;