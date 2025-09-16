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

  const closeMenu = () => setMenuOpen(false);

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

        {/* Hamburger (mobile only) */}
        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <FaBars size={24} />
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

        {/* Overlay */}
        {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

        {/* Mobile side navigation */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          <div className="close-btn" onClick={closeMenu}>
            <FaTimes size={24} />
          </div>
          <ul>
            <li>
              <Link to="/reservation" onClick={closeMenu}>
                Reservation
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/feedback" onClick={closeMenu}>
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
