import React, { useEffect, useState } from "react";
import "./css/Homepage.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // if not logged in, redirect to login
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">EveRest Portal</div>
        <ul className="nav-links">
          <li>
            <a href="#reservation">Reservation</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#feedback">Feedback</a>
          </li>
          <li className="user-icon">
            <FaUserCircle size={28} />
            {user && <span className="username"> {user.firstname}</span>}
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome {user ? user.firstname : "Guest"} to EveRest Portal</h1>
        <p>Memorial Lot Reservation System for Public Cemetery</p>
        <a href="#reservation" className="btn">
          Reserve Now
        </a>
      </section>
    </div>
  );
}

export default Homepage;
