import { Link, Outlet } from "react-router-dom";
import "../admin_css/Admin.css";

function Admin() {
  return (
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
      </div>
      <Outlet />
      {/* Main Content */}
      <div className="admin-container"></div>
    </div>
  );
}

export default Admin;
