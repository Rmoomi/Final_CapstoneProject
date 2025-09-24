import React, { useEffect, useState } from "react";
import "./css/Feedback.css";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ✅ Fetch feedbacks for this user only
  useEffect(() => {
    if (!user) {
      setFeedbacks([]);
      return;
    }

    fetch(`${API_URL}/api/feedback?user_id=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        if (data.success) setFeedbacks(data.feedbacks);
      })
      .catch((err) => console.error("Error fetching feedback:", err));
  }, [API_URL, user]);

  // ✅ Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit feedback.");
      return;
    }
    if (rating === 0 || message.trim() === "") {
      alert("Please select a rating and enter a message.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          rating,
          message,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setFeedbacks([data.feedback, ...feedbacks]);
        setRating(0);
        setMessage("");
      } else {
        alert(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  // ✅ Delete modal
  const confirmDelete = (feedbackId) => {
    setFeedbackToDelete(feedbackId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/feedback/${feedbackToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackToDelete));
        setShowModal(false);
        setFeedbackToDelete(null);
      } else {
        alert(data.message || "Failed to delete feedback");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div className="feedback-container">
      <h2>User Feedback</h2>

      {/* ✅ Feedback Form */}
      {user ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <label>Rate Our Services:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={num <= rating ? "star filled" : "star"}
                onClick={() => setRating(num)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      ) : (
        <p className="no-feedback">Log in to submit feedback.</p>
      )}

      {/* ✅ Feedback List */}
      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback yet.</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <div className="feedback-header">
                <span className="feedback-rating">
                  {"★".repeat(fb.rating) + "☆".repeat(5 - fb.rating)}
                </span>
                <span
                  className={`feedback-status ${
                    fb.status === "approved" ? "approved" : "delivered"
                  }`}
                >
                  {fb.status}
                </span>
              </div>
              <p className="feedback-message">"{fb.message}"</p>
              <div className="feedback-footer">
                <span>User ID: {fb.user_id}</span>
                <span className="feedback-date">
                  {new Date(fb.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* ✅ Show admin reply */}
              {fb.reply && (
                <div className="admin-reply">
                  <strong>Admin Reply:</strong>
                  <p>{fb.reply}</p>
                </div>
              )}

              {/* ✅ Delete button */}
              {user && fb.user_id === user.id && (
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(fb.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this feedback?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
