import React, { useEffect, useState } from "react";
import "./css/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // ✅ Try both string and JSON storage
        let userId = localStorage.getItem("user_id");

        // If not stored directly, maybe saved under "user" object
        if (!userId) {
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsed = JSON.parse(userData);
            userId = parsed.id; // match backend `user.id`
          }
        }

        if (!userId) {
          console.error("❌ No user_id found in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/notifications/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        } else {
          console.error("No notifications found:", data.message);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Mark as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${id}/read`,
        { method: "PATCH" }
      );
      const data = await response.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="notification-container">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${
              notification.status === "unread" ? "unread" : "read"
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <small>{new Date(notification.date).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p className="no-notifications">No notifications found.</p>
      )}
    </div>
  );
}

export default Notifications;
