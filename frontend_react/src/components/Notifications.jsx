import React, { useEffect, useState } from "react";
import "./css/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [shownIds, setShownIds] = useState([]); // ✅ track already shown push notifications

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ✅ Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // ✅ Get user_id
        let userId = localStorage.getItem("user_id");
        if (!userId) {
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsed = JSON.parse(userData);
            userId = parsed.id;
          }
        }

        if (!userId) {
          console.error("❌ No user_id found in localStorage");
          return;
        }

        const response = await fetch(`${API_URL}/api/notifications/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);

          // ✅ Only show *new unread* notifications that haven’t been shown before
          data.notifications
            .filter((n) => n.status === "unread" && !shownIds.includes(n.id))
            .forEach((n) => {
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification(n.title, {
                  body: n.message,
                  icon: "/notification-icon.png", // optional icon
                });

                // ✅ Mark this notification as shown (so it won’t repeat)
                setShownIds((prev) => [...prev, n.id]);
              }
            });
        } else {
          console.error("No notifications found:", data.message);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    // ✅ Poll every 10s for new notifications
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [API_URL, shownIds]); // include shownIds so it updates properly

  // ✅ Mark as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
      });
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
