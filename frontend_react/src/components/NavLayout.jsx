import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./css/Homepage.css";

function NavLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/"); // redirect to login
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">EveRest Portal</div>
        <ul className="nav-links">
          <li>
            <Link to="/reservation">Reservation</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
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

      {/* Page content will be injected here */}
      <Outlet />
    </div>
  );
}

export default NavLayout;
