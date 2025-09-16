import React, { useState } from "react";
import "./css/Reservation.css";

function Reservation() {
  const [formData, setFormData] = useState({
    cemetery: "",
    fullname: "",
    contact: "",
    date: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] }); // save uploaded file
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation Submitted:", formData);
    alert("Your reservation request has been submitted!");
    setFormData({
      cemetery: "",
      fullname: "",
      contact: "",
      date: "",
      photo: null,
    });
  };

  return (
    <div className="reservation-container">
      <h2>Burial Lot Reservation</h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        {/* Cemetery dropdown */}
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

        {/* Full Name */}
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

        {/* Contact */}
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

        {/* Date */}
        <label htmlFor="date">Date of Reservation</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* Photo Upload */}
        <label htmlFor="photo">Photo of the Lot or Area</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
        />

        {/* Submit */}
        <button type="submit" className="submit-btn">
          Reserve Now
        </button>
      </form>
    </div>
  );
}

export default Reservation;
