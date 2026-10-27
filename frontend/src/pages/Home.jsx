import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function Home() {
  const navigate = useNavigate();

  const handleSearch = (data) => {
    const params = new URLSearchParams(data).toString();

    navigate(`/rooms?${params}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>

          <p>
            Discover comfortable rooms and book your stay with ease.
          </p>

          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <section className="features">
        <h2>Why Choose StayEase?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <span>🛏️</span>
            <h3>Comfortable Rooms</h3>
            <p>Clean and comfortable rooms for every type of traveler.</p>
          </div>

          <div className="feature-card">
            <span>🔒</span>
            <h3>Secure Booking</h3>
            <p>Your reservation information is securely managed.</p>
          </div>

          <div className="feature-card">
            <span>💰</span>
            <h3>Affordable Prices</h3>
            <p>Choose rooms according to your budget.</p>
          </div>

          <div className="feature-card">
            <span>⭐</span>
            <h3>Quality Service</h3>
            <p>Enjoy a smooth and convenient hotel experience.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;