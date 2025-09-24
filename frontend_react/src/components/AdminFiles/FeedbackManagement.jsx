import React, { useEffect, useState } from "react";
import "../admin_css/FeedbackManagement.css";

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ✅ Fetch all feedbacks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/feedback`);
        if (!res.ok) throw new Error(`Failed to fetch feedback: ${res.status}`);
        const data = await res.json();

        const feedbackArray = Array.isArray(data) ? data : data.feedbacks || [];
        setFeedbacks(feedbackArray);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Could not load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // ✅ Handle reply submit
  const handleReply = async (feedbackId) => {
    if (!replyText[feedbackId]) return;

    try {
      const res = await fetch(`${API_URL}/api/feedback/${feedbackId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText[feedbackId] }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      const data = await res.json();

      // ✅ Update with reply
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === feedbackId
            ? { ...fb, reply: data.reply || replyText[feedbackId] }
            : fb
        )
      );

      setReplyText((prev) => ({ ...prev, [feedbackId]: "" }));
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply. Please try again.");
    }
  };

  if (loading) return <p className="loading">Loading feedback...</p>;
  if (error) return <p className="error">{error}</p>;

  const totalFeedbacks = feedbacks.length;
  const pendingFeedbacks = feedbacks.filter((fb) => !fb.reply).length;

  return (
    <div className="feedback-management">
      <h1>User Feedback Management</h1>

      {/* ✅ Summary */}
      <div className="summary-cards">
        <div className="summary-card total">
          <h3>Total Feedback</h3>
          <p>{totalFeedbacks}</p>
        </div>
        <div className="summary-card pending">
          <h3>Pending Replies</h3>
          <p>{pendingFeedbacks}</p>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback found.</p>
      ) : (
        feedbacks.map((fb) => (
          <div className="feedback-card" key={fb.id}>
            <div className="feedback-header">
              <h3>
                {`${fb.firstname || ""} ${fb.lastname || ""}`.trim() ||
                  "Anonymous"}
              </h3>
              <span className="feedback-date">
                {new Date(fb.created_at).toLocaleString()}
              </span>
            </div>
            <p className="feedback-message">"{fb.message}"</p>
            <p className="feedback-rating">⭐ {fb.rating}</p>

            {fb.reply ? (
              <div className="admin-reply">
                <strong>Admin Reply:</strong>
                <p>{fb.reply}</p>
              </div>
            ) : (
              <div className="reply-box">
                <textarea
                  placeholder="Write a reply..."
                  value={replyText[fb.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [fb.id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleReply(fb.id)}>Send Reply</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackManagement;
