import RegisterAcc from "./components/Register.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Admin from "./components/AdminFiles/Admin.jsx";
import Homepage from "./components/Homepage.jsx";
import ReservationManagement from "./components/AdminFiles/ReservationManagement.jsx";
import FeedbackManagement from "./components/AdminFiles/FeedbackManagement.jsx";
import ReportGenerator from "./components/AdminFiles/ReportGenerator.jsx";
import UserManagement from "./components/AdminFiles/UserManagement.jsx";
import Dashboard from "./components/AdminFiles/Dashboard.jsx"; // placeholder for admin home

import Reservation from "./components/Reservation.jsx";
import DigitalMap from "./components/DigitalMap.jsx";
import Notifications from "./components/Notifications.jsx";
import Feedback from "./components/Feedback.jsx";
import NavLayout from "./components/NavLayout.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterAcc />} />
        <Route path="/login" element={<Login />} />

        {/* Admin layout with nested routes */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} /> {/* default page */}
          <Route path="users" element={<UserManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          <Route path="reports" element={<ReportGenerator />} />
        </Route>
        <Route element={<NavLayout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/digitalmap" element={<DigitalMap />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
