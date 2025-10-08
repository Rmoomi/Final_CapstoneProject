import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { onMessageListener } from "../firebase"; // ✅ import listener
import "./css/Homepage.css";

function Homepage() {
  useEffect(() => {
    // ✅ Listen for foreground notifications
    const unsubscribe = onMessageListener((payload) => {
      const title =
        payload.notification?.title || payload.data?.title || "Notification";
      const body = payload.notification?.body || payload.data?.message || "";

      // ✅ Show browser notification popup
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/notification-icon.png" });
      } else {
        console.log("Notification permission not granted.");
      }

      // ✅ Log or update UI if needed
      console.log("Foreground message received:", payload);
    });

    // ✅ Cleanup listener when leaving the page
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <section className="hero">
      <h1>Welcome to EveRest Portal</h1>
      <p>Memorial Lot Reservation System for Public Cemetery</p>
      <Link to="/reservation" className="btn">
        Reserve Now
      </Link>
    </section>
  );
}

export default Homepage;
