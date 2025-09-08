import React from "react";
import "./css/Homepage.css";
import { FaUserCircle } from "react-icons/fa";

function Homepage() {
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
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to EveRest Portal</h1>
        <p>Memorial Lot Reservation System for Public Cemetery</p>
        <a href="#reservation" className="btn">
          Reserve Now
        </a>
      </section>
    </div>
  );
}

export default Homepage;
