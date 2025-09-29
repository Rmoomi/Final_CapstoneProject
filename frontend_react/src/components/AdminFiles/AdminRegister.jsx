import "../admin_css/AdminAcc.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminRegister() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cemetery_name: "",
    fullname: "",
    email: "",
    pass: "",
    confirmPass: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleRegister = async () => {
    if (formData.pass !== formData.confirmPass) {
      showErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Register response:", data);

      if (res.ok && data.success) {
        // ✅ Save admin info in localStorage
        localStorage.setItem("admin", JSON.stringify(data.admin));

        // ✅ Redirect to admin dashboard
        navigate("/admin");
      } else {
        showErrorMessage(data.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Error registering:", err);
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
          <h2>Admin Registration</h2>
          <p className="subtitle">Create a new admin account</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <label>Cemetery Name</label>
            <select
              name="cemetery_name"
              value={formData.cemetery_name}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Cemetery --</option>
              <option value="Mintal Public Cemetery">
                Mintal Public Cemetery
              </option>
              <option value="Tugbok Public Cemetery">
                Tugbok Public Cemetery
              </option>
              <option value="Tibongko Public Cemetery">
                Tibongko Public Cemetery
              </option>
            </select>

            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPass"
              value={formData.confirmPass}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

            <button type="submit" className="btn-blue" disabled={loading}>
              {loading ? "Registering..." : "SIGN UP"}
            </button>
          </form>

          <p className="signup-link">
            Already have an account?
            <a onClick={() => navigate("/admin/login")}> Sign in</a>
          </p>
        </div>
      </main>
    </>
  );
}

export default AdminRegister;
