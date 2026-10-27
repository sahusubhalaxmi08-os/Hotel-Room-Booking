import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          🏨 StayEase
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>

          {token && <Link to="/my-bookings">My Bookings</Link>}

          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="nav-button">
                Register
              </Link>
            </>
          ) : (
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;