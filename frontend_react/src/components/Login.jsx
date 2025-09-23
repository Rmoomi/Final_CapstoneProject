import "./css/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayInput, setInput] = useState({
    email: "",
    pass: "",
  });

  // ✅ Use backend URL (set in .env or fallback to localhost:8080)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleLogin = async () => {
    setLoading(true); // ✅ start loading
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(displayInput),
      });

      const data = await res.json();
      console.log("Server says:", data);

      if (res.ok && data.success) {
        // ✅ Save user info
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect
        navigate("/homepage");
      } else {
        showErrorMessage();
      }
    } catch (err) {
      console.error("Error logging in:", err);
      showErrorMessage();
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const showErrorMessage = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {/* ✅ Error Pop-up */}
      <div className={`popup ${showError ? "show" : ""}`}>
        INVALID USERNAME OR PASSWORD
      </div>

      <main className="login-container">
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
    </>
  );
}

export default Login;
