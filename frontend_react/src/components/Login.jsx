import "./css/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [displayInput, setInput] = useState({
    email: "",
    pass: "",
  });

  const handleLogin = () => {
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(displayInput),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server says:", data);

        if (data.success) {
          // ✅ Save user info in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));

          // redirect to homepage
          navigate("/homepage");
        } else {
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
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
      {/* Pop-up error */}
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

            <button type="submit" className="btn-blue">
              SIGN IN
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
