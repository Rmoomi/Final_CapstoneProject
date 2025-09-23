import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../admin_css/Admin.css";

function Admin() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("admin"); // or "user", depending on your storage key
    navigate("/"); // redirect to login page
  };
  return (
    <>
      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <h2>Admin Panel</h2>
          <ul>
            <Link to="/admin">
              <li>Dashboard</li>
            </Link>
            <Link to="/admin/users">
              <li>User Management</li>
            </Link>
            <Link to="/admin/reservations">
              <li>Reservation Management</li>
            </Link>
            <Link to="/admin/feedback">
              <li>Feedback Management</li>
            </Link>
            <Link to="/admin/reports">
              <li>Report Generator</li>
            </Link>
          </ul>
          <div className="logout-section">
            <button className="logout-btn" onClick={() => setShowModal(true)}>
              Logout
            </button>
          </div>
        </div>

        <Outlet />
        {/* Main Content */}
        <div className="admin-container"></div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button onClick={handleLogout} className="confirm-btn">
                Logout
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
