import React, { useEffect, useState } from "react";
import "../admin_css/FeedbackManagement.css";

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyText, setReplyText] = useState({});

  // ✅ Fetch feedbacks (dummy fetch for now, replace with your API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/feedback"); // replace with your backend route
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle reply submit
  const handleReply = async (feedbackId) => {
    if (!replyText[feedbackId]) return;

    try {
      const res = await fetch(`/api/feedback/${feedbackId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText[feedbackId] }),
      });

      if (res.ok) {
        alert("Reply sent successfully!");
        setReplyText((prev) => ({ ...prev, [feedbackId]: "" }));
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  return (
    <div className="feedback-management">
      <h1>User Feedback Management</h1>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback found.</p>
      ) : (
        feedbacks.map((fb) => (
          <div className="feedback-card" key={fb.feedback_id}>
            <div className="feedback-header">
              <h3>{fb.fullname}</h3>
              <span className="feedback-date">
                {new Date(fb.created_at).toLocaleString()}
              </span>
            </div>
            <p className="feedback-message">{fb.message}</p>

            {/* If already replied, show the reply */}
            {fb.reply ? (
              <div className="admin-reply">
                <strong>Admin Reply:</strong>
                <p>{fb.reply}</p>
              </div>
            ) : (
              <div className="reply-box">
                <textarea
                  placeholder="Write a reply..."
                  value={replyText[fb.feedback_id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [fb.feedback_id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleReply(fb.feedback_id)}>
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackManagement;
