import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddRoom() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Single",
    price: "",
    capacity: 1,
    description: "",
    image: "",
    amenities: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/rooms", {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      alert("Room added successfully!");

      navigate("/admin/rooms");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to add room."
      );
    }
  };

  return (
    <div className="admin-form">
      <h1>Add New Room</h1>

      <form onSubmit={handleSubmit}>
        <label>Room Number</label>
        <input
          type="text"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          placeholder="Example: 101"
          required
        />

        <label>Room Type</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option>Single</option>
          <option>Double</option>
          <option>Deluxe</option>
          <option>Suite</option>
        </select>

        <label>Price Per Night</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Capacity</label>
        <input
          type="number"
          name="capacity"
          min="1"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Room description"
        />

        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Room image URL"
        />

        <label>Amenities</label>
        <input
          type="text"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          placeholder="WiFi, AC, TV, Breakfast"
        />

        <button className="primary-btn">
          Add Room
        </button>
      </form>
    </div>
  );
}

export default AddRoom;