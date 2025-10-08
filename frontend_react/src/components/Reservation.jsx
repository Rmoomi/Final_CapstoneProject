import React, { useState, useEffect } from "react";
import "./css/Reservation.css";

function Reservation() {
  const [formData, setFormData] = useState({
    cemetery: "",
    fullname: "",
    contact: "",
    date: "",
    photo: null,
    user_id: null,
  });

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]); // ✅ store all reservations

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setFormData((prev) => ({ ...prev, user_id: storedUser.id }));
      fetchReservations(storedUser.id);
    }
  }, []);

  // ✅ Fetch ALL reservations for this user
  const fetchReservations = async (userId) => {
    try {
      console.log(
        "📡 Fetching reservations from:",
        `${API_URL}/api/reservations`
      );

      const res = await fetch(`${API_URL}/api/reservations`, {
        headers: { "Content-Type": "application/json" },
      });

      const text = await res.text(); // 👀 To debug what comes back
      console.log("🔍 Raw response:", text);

      const result = JSON.parse(text);

      if (result.success && result.reservations) {
        const userReservations = result.reservations.filter(
          (r) => String(r.user_id) === String(userId)
        );

        userReservations.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReservations(userReservations);
      } else {
        console.warn("⚠️ No reservations found or invalid format:", result);
      }
    } catch (err) {
      console.error("❌ Error fetching reservations:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("cemetery", formData.cemetery);
      data.append("fullname", formData.fullname);
      data.append("contact", formData.contact);
      data.append("date", formData.date);
      data.append("photo", formData.photo);
      data.append("user_id", formData.user_id);

      const res = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Reservation submitted successfully!");
        setFormData({
          cemetery: "",
          fullname: "",
          contact: "",
          date: "",
          photo: null,
          user_id: formData.user_id,
        });
        document.getElementById("photo").value = "";
        fetchReservations(formData.user_id);
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (err) {
      console.error("Error submitting reservation:", err);
      alert("❌ An error occurred while submitting reservation.");
    }

    setLoading(false);
  };

  return (
    <div className="reservation-layout">
      {/* ✅ LEFT SIDE (Reservation Form) */}
      <div className="reservation-form-container">
        <h2>Burial Lot Reservation</h2>
        <form className="reservation-form" onSubmit={handleSubmit}>
          <label htmlFor="cemetery">Select Cemetery</label>
          <select
            name="cemetery"
            id="cemetery"
            value={formData.cemetery}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Cemetery --</option>
            <option value="Mintal Public Cemetery">
              Mintal Public Cemetery
            </option>
            <option value="Tugbok Public Cemetery">
              Tugbok Public Cemetery
            </option>
            <option value="Tibongko Public Cemetery">
              Tibongko Public Cemetery
            </option>
          </select>

          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="contact">Contact Number</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="e.g. 09xxxxxxxxx"
            required
          />

          <label htmlFor="date">Date of Reservation</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="photo">Photo of the Lot or Area</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Reserve Now"}
          </button>
        </form>
      </div>
      {/* ✅ LEFT SIDE END */}

      {/* ✅ RIGHT SIDE (Scrollable Reservations List) */}
      <div className="reservation-card-container">
        <h3>Your Reservations</h3>
        <div className="reservation-list">
          {reservations.length > 0 ? (
            reservations.map((res, idx) => (
              <div key={idx} className="reservation-card">
                <p>
                  <strong>Cemetery:</strong> {res.cemetery}
                </p>
                <p>
                  <strong>Name:</strong> {res.fullname}
                </p>
                <p>
                  <strong>Contact:</strong> {res.contact}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(res.date).toLocaleDateString()}
                </p>
                {res.photo && (
                  <img
                    src={`${API_URL}/uploads/${res.photo}`}
                    alt="Lot"
                    className="reservation-photo"
                  />
                )}
                <p className={`status ${res.status}`}>
                  Status: {res.status || "pending"}
                </p>
              </div>
            ))
          ) : (
            <p>No reservations yet.</p>
          )}
        </div>
      </div>
      {/* ✅ RIGHT SIDE END */}
    </div>
  );
}

export default Reservation;
