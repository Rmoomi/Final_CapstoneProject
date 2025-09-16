import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Register.css";

function RegisterUser() {
  const navigate = useNavigate();
  const initialForm = {
    firstname: "",
    lastname: "",
    contact: "",
    email: "",
    pass: "",
    confirmPass: "",
  };
  const [displayInput, setInput] = useState(initialForm);
  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8080";

  // Send form data to backend
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(displayInput),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server says:", data);

        if (data.userID) {
          alert("Registered Successfully!");
          setInput(initialForm); // reset form
          navigate("/homepage"); // redirect to login
        } else {
          alert("Failed: " + data.message);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
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
    <div className="form_container">
      <div className="register_header">
        <h2>DON'T HAVE AN ACCOUNT?</h2>
        <h4>REGISTER HERE</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fullname">
          <div className="firstElement">
            <label>Firstname</label>
            <input
              type="text"
              name="firstname"
              value={displayInput.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="secondElement">
            <label>Lastname</label>
            <input
              type="text"
              name="lastname"
              value={displayInput.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="contact_confPass_inputs">
          <label>Contact Number</label>
          <input
            type="text"
            name="contact"
            value={displayInput.contact}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={displayInput.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="pass"
            value={displayInput.pass}
            onChange={handleChange}
            required
          />
          {displayInput.pass.length > 0 && displayInput.pass.length < 8 && (
            <p className="pass_feedback">
              Password must be at least 8 characters with a number.
            </p>
          )}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPass"
            value={displayInput.confirmPass}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submitBtn">
          Register
        </button>
        <button
          type="button"
          className="btn_link"
          onClick={() => navigate("/login")}
        >
          I already have an account
        </button>
      </form>
    </div>
  );
}
export default RegisterUser;
