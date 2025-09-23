import React, { useState, useEffect } from "react";
import "./css/Reservation.css";

function Reservation() {
  const [formData, setFormData] = useState({
    cemetery: "",
    fullname: "",
    contact: "",
    date: "",
    photo: null,
    user_id: null, // ✅ include user_id
  });

  const [loading, setLoading] = useState(false);

  // ✅ Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setFormData((prev) => ({ ...prev, user_id: storedUser.id }));
    }
  }, []);

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
      data.append("user_id", formData.user_id); // ✅ send user_id

      const res = await fetch("http://localhost:8080/api/reservation", {
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
          user_id: formData.user_id, // keep user_id
        });
        document.getElementById("photo").value = "";
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
    <div className="reservation-container">
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
          <option value="Mintal Public Cemetery">Mintal Public Cemetery</option>
          <option value="Tugbok Public Cemetery">Tugbok Public Cemetery</option>
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
  );
}

export default Reservation;
