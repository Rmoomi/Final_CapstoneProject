import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin_css/ReservationManagement.css";

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    cemetery: "",
    fullname: "",
    contact: "",
    date: "",
    status: "pending",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/reservations");
      if (res.data.success) setReservations(res.data.reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/api/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/reservations/${id}`, formData);
      setEditing(null);
      fetchReservations();
    } catch (err) {
      console.error("Error updating reservation:", err);
    }
  };

  const handleEdit = (reservation) => {
    setEditing(reservation.id);
    setFormData({
      cemetery: reservation.cemetery,
      fullname: reservation.fullname,
      contact: reservation.contact,
      date: reservation.date,
      status: reservation.status,
    });
  };

  // ✅ Compute stats dynamically
  const totalReservations = reservations.length;
  const pendingCount = reservations.filter(
    (r) => r.status === "pending"
  ).length;
  const approvedCount = reservations.filter(
    (r) => r.status === "approved"
  ).length;

  return (
    <div className="reservation-management">
      <div className="header">
        <h1>Reservation Management</h1>
        <button className="btn-primary">+ New Reservation</button>
      </div>

      {/* ✅ Stats cards (dynamic) */}
      <div className="stats">
        <div className="card">
          <h3>Total Reservations</h3>
          <p>{totalReservations}</p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p className="pending">{pendingCount}</p>
        </div>
        <div className="card">
          <h3>Approved</h3>
          <p className="approved">{approvedCount}</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="filters">
        <input type="text" placeholder="Search reservations..." />
        <select>
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
        <button className="btn-secondary">More Filters</button>
      </div>

      {/* Reservations table */}
      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cemetery</th>
            <th>Fullname</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Status</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>
                {editing === r.id ? (
                  <input
                    value={formData.cemetery}
                    onChange={(e) =>
                      setFormData({ ...formData, cemetery: e.target.value })
                    }
                  />
                ) : (
                  r.cemetery
                )}
              </td>
              <td>
                {editing === r.id ? (
                  <input
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                  />
                ) : (
                  r.fullname
                )}
              </td>
              <td>
                {editing === r.id ? (
                  <input
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                  />
                ) : (
                  r.contact
                )}
              </td>
              <td>
                {editing === r.id ? (
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                ) : (
                  r.date
                )}
              </td>
              <td>
                {editing === r.id ? (
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                ) : (
                  <span className={`status ${r.status}`}>{r.status}</span>
                )}
              </td>
              <td>
                {r.photo ? (
                  <img
                    src={`/uploads/${r.photo}`}
                    alt="reservation"
                    width="50"
                  />
                ) : (
                  "No photo"
                )}
              </td>
              <td className="actions">
                {editing === r.id ? (
                  <>
                    <button
                      className="btn-save"
                      onClick={() => handleUpdate(r.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit" onClick={() => handleEdit(r)}>
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(r.id)}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationManagement;
