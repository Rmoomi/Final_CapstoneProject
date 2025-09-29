import "../admin_css/AdminAcc.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLogin() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Admin login response:", data);

      if (res.ok && data.success) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/admin"); // ✅ redirect to admin dashboard
      } else {
        showErrorMessage("Invalid email or password!");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      showErrorMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = (msg) => {
    setShowError(msg);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* ✅ Error Pop-up */}
      <div className={`popup ${showError ? "show" : ""}`}>{showError}</div>

      <main className="login-container">
        <div className="login-box">
          <h2>Admin Login</h2>
          <p className="subtitle">Sign in to manage the cemetery system</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="pass"
              value={formData.pass}
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-blue" disabled={loading}>
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <p className="signup-link">
            Don’t have an account?
            <a onClick={() => navigate("/admin/register")}> Sign up</a>
          </p>
        </div>
      </main>
    </>
  );
}

export default AdminLogin;
