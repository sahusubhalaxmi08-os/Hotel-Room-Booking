import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "",
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div>
        <label>Check In</label>
        <input
          type="date"
          name="checkIn"
          value={searchData.checkIn}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Check Out</label>
        <input
          type="date"
          name="checkOut"
          value={searchData.checkOut}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Guests</label>
        <input
          type="number"
          min="1"
          name="guests"
          value={searchData.guests}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Room Type</label>
        <select
          name="roomType"
          value={searchData.roomType}
          onChange={handleChange}
        >
          <option value="">All Rooms</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
        </select>
      </div>

      <button type="submit">Search Rooms</button>
    </form>
  );
}

export default SearchBar;