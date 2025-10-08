import "./css/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import adminIcon from "../assets/admin_icon.png";
import { requestFcmToken } from "../firebase"; // ✅ FCM helper

function Login() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [displayInput, setDisplayInput] = useState({
    email: "",
    pass: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(displayInput),
      });

      const data = await res.json();
      console.log("Server says:", data);

      if (res.ok && data.success) {
        // ✅ Save user info locally
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Request FCM token after login
        try {
          const token = await requestFcmToken();
          if (token) {
            const registerRes = await fetch(`${API_URL}/api/fcm/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: data.user.id,
                token,
              }),
            });

            if (registerRes.ok) {
              console.log("✅ FCM token registered successfully");
            } else {
              console.warn("⚠️ Failed to register token on backend");
            }
          } else {
            console.warn("⚠️ No FCM token received (permission denied?)");
          }
        } catch (e) {
          console.error("⚠️ FCM registration error:", e);
        }

        // ✅ Redirect to homepage
        navigate("/homepage");
      } else {
        showErrorMessage();
      }
    } catch (err) {
      console.error("Error logging in:", err);
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisplayInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* ❌ Error Pop-up */}
      <div className={`popup ${showError ? "show" : ""}`}>
        INVALID USERNAME OR PASSWORD
      </div>

      <main className="login-container">
        <img
          src={adminIcon}
          alt="Admin Login"
          className="to_admin_login"
          style={{ cursor: "pointer", width: "40px", marginBottom: "16px" }}
          onClick={() => setShowAdminModal(true)}
        />
        <div className="login-box">
          <h2>Welcome To Everest Portal</h2>
          <p className="subtitle">Sign in to access your account</p>

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
              value={displayInput.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="pass"
              value={displayInput.pass}
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
            <a onClick={() => navigate("/register")}> Sign up</a>
          </p>
        </div>
      </main>

      {/* ⚠️ Admin Modal */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-box scary">
            <button
              className="modal-close"
              onClick={() => setShowAdminModal(false)}
            >
              ✖
            </button>
            <h2>RESTRICTED AREA</h2>
            <p>
              Only <strong>AUTHORIZED PERSONNEL</strong> may proceed.
              Unauthorized access will be <span className="danger">DENIED</span>
              .
            </p>
            <button
              className="proceed-btn"
              onClick={() => navigate("/admin/login")}
            >
              PROCEED
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
