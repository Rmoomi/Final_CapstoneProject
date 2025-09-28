import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin_css/ReservationManagement.css";

// ✅ Import icons
import editIcon from "../../assets/edit-icon.png";
import deleteIcon from "../../assets/delete-icon.png";

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

  // ✅ Approve reservation and send notification
  async function handleApproveReservation(reservation) {
    try {
      await axios.put(
        `http://localhost:8080/api/reservations/${reservation.id}`,
        {
          cemetery: reservation.cemetery,
          fullname: reservation.fullname,
          contact: reservation.contact,
          date: reservation.date,
          status: "approved",
        }
      );

      // ✅ Insert notification
      await axios.post("http://localhost:8080/api/notifications", {
        user_id: reservation.user_id,
        title: "Reservation Approved ✅",
        message: `Hello ${reservation.fullname}, your reservation at ${reservation.cemetery} on ${reservation.date} has been approved.`,
      });

      fetchReservations();
      alert("Reservation approved and client has been notified.");
    } catch (error) {
      console.error("Error approving reservation:", error);
      alert("Failed to approve reservation. Please try again.");
    }
  }

  // ✅ New states for search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

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

  const handleUpdate = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/reservations/${id}`, {
        ...formData,
        status: currentStatus === "approved" ? "approved" : formData.status, // ✅ keep approved
      });

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

  // ✅ Stats
  const totalReservations = reservations.length;
  const pendingCount = reservations.filter(
    (r) => r.status === "pending"
  ).length;
  const approvedCount = reservations.filter(
    (r) => r.status === "approved"
  ).length;

  // ✅ Apply search & filter
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cemetery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contact.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || r.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="reservation-management">
      <div className="header">
        <h1>Reservation Management</h1>
        <button className="btn-primary">+ New Reservation</button>
      </div>

      {/* ✅ Stats cards */}
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

      {/* ✅ Search + filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search reservations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
      </div>

      {/* ✅ Reservations table */}
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
          {filteredReservations.length > 0 ? (
            filteredReservations.map((r) => (
              <tr key={r.id}>
                {editing === r.id ? (
                  <>
                    <td>{r.id}</td>
                    <td>
                      <input
                        type="text"
                        value={formData.cemetery}
                        onChange={(e) =>
                          setFormData({ ...formData, cemetery: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.fullname}
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        disabled={r.status === "approved"} // ✅ lock if approved
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                      </select>
                    </td>
                    <td>{r.photo ? "Has photo" : "No photo"}</td>
                    <td>
                      <button
                        className="btn-save"
                        onClick={() => handleUpdate(r.id, r.status)}
                      >
                        Save
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{r.id}</td>
                    <td>{r.cemetery}</td>
                    <td>{r.fullname}</td>
                    <td>{r.contact}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className={`status ${r.status}`}>{r.status}</span>
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
                      {/* ✅ Show approve button ONLY if still pending */}
                      {r.status === "pending" && (
                        <button
                          className="btn-approve"
                          onClick={() => handleApproveReservation(r)}
                        >
                          ✅ Approve
                        </button>
                      )}

                      {/* Edit + Delete are always visible */}
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(r)}
                      >
                        <img src={editIcon} alt="Edit" width="24" height="24" />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(r.id)}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          width="24"
                          height="24"
                        />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationManagement;
