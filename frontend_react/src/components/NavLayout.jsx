import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "./css/NavBar.css";

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
        {/* Logo */}
        <div
          className="logo"
          onClick={() => {
            navigate("/homepage");
          }}
        >
          <span className="logo-icon">📍</span> EveRest Portal
        </div>

        {/* Hamburger (mobile only) */}
        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <FaBars size={22} />
        </div>

        {/* Desktop nav links */}
        <ul className="nav-links desktop-menu">
          <li>
            <Link to="/homepage">Home</Link>
          </li>
          <li>
            <Link to="/map">Digital Cemetery Map</Link>
          </li>
          <li>
            <Link to="/reservation">Reservations</Link>
          </li>
          <li>
            <Link to="/notifications">Notifications</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
          </li>

          {/* ✅ Show logged in user's FIRST NAME */}
          {user && (
            <li className="user-display">
              <FaUserCircle size={18} style={{ marginRight: "6px" }} />
              {user.firstname || "User"}
            </li>
          )}

          <li>
            {user ? (
              <button onClick={handleLogout} className="login-btn">
                Logout
              </button>
            ) : (
              <Link to="/login" className="login-btn">
                Login
              </Link>
            )}
          </li>
        </ul>

        {/* Overlay */}
        {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

        {/* Mobile side navigation */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          <div className="close-btn" onClick={closeMenu}>
            <FaTimes size={22} />
          </div>
          <ul>
            <li>
              <Link to="/homepage" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/map" onClick={closeMenu}>
                Digital Cemetery Map
              </Link>
            </li>
            <li>
              <Link to="/reservation" onClick={closeMenu}>
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/notifications" onClick={closeMenu}>
                Notifications
              </Link>
            </li>
            <li>
              <Link to="/feedback" onClick={closeMenu}>
                Feedback
              </Link>
            </li>

            {/* ✅ Show logged in user's FIRST NAME in mobile menu */}
            {user && (
              <li className="user-display">
                <FaUserCircle size={18} style={{ marginRight: "6px" }} />
                {user.firstname || "User"}
              </li>
            )}

            <li>
              {user ? (
                <button onClick={handleLogout} className="login-btn">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              )}
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
