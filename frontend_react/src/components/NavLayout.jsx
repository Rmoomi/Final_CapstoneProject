import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "./css/Homepage.css";

function NavLayout() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
        <div
          className="logo"
          onClick={() => {
            navigate("/homepage");
          }}
        >
          EveRest Portal
        </div>

        {/* Hamburger icon (only shows on mobile) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Desktop nav links */}
        <ul className="nav-links desktop-menu">
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

        {/* Mobile side navigation */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/reservation" onClick={() => setMenuOpen(false)}>
                Reservation
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/feedback" onClick={() => setMenuOpen(false)}>
                Feedback
              </Link>
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
        </div>
      </nav>

      {/* Page content */}
      <Outlet />
    </div>
  );
}

export default NavLayout;
