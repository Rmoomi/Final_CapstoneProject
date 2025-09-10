import React from "react";
import { Link } from "react-router-dom";
import "./css/Homepage.css";

function Homepage() {
  return (
    <section className="hero">
      <h1>Welcome to EveRest Portal</h1>
      <p>Memorial Lot Reservation System for Public Cemetery</p>
      <Link to="/reservation" className="btn">
        Reserve Now
      </Link>
    </section>
  );
}

export default Homepage;
