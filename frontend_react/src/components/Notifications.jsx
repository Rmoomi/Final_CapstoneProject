// src/components/Notifications.jsx
import React, { useEffect, useState } from "react";
import "./css/Notifications.css";

const API_URL = import.meta.env.VITE_API_URL;

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [shownIds, setShownIds] = useState([]);

  // ✅ Fetch list and show local browser notifications
  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const userRaw =
          localStorage.getItem("user") || localStorage.getItem("user_id");
        let userId = null;
        try {
          userId = userRaw
            ? typeof userRaw === "string"
              ? JSON.parse(userRaw)?.id || userRaw
              : userRaw
            : null;
        } catch {
          userId = userRaw;
        }
        if (!userId) return;

        const res = await fetch(`${API_URL}/api/notifications/${userId}`);
        if (!res.ok) {
          console.error("Backend returned non-OK:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success && mounted) {
          setNotifications(data.notifications);

          // ✅ Show browser notification for new unread ones
          data.notifications
            .filter((n) => n.status === "unread" && !shownIds.includes(n.id))
            .forEach((n) => {
              try {
                // Ask permission if not yet granted
                if (Notification.permission !== "granted") {
                  Notification.requestPermission();
                }
                if (Notification.permission === "granted") {
                  new Notification(n.title, {
                    body: n.message,
                    icon: "/notification-icon.png",
                  });
                  setShownIds((prev) => [...prev, n.id]);
                }
              } catch (e) {
                console.warn("Notification display failed:", e);
              }
            });
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [shownIds]);

  // ✅ Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success)
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
        );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-container">
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`notification ${
              n.status === "unread" ? "unread" : "read"
            }`}
            onClick={() => markAsRead(n.id)}
          >
            <h4>{n.title}</h4>
            <p>{n.message}</p>
            <small>{new Date(n.date).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p className="no-notifications">No notifications found.</p>
      )}
    </div>
  );
}

export default Notifications;
