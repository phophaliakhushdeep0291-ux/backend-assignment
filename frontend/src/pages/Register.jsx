import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api"; // Your axios instance with withCredentials: true

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "user", // Default role based on your controller
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/register", formData);

      if (response.data.success) {
        // Updated message to match your backend's email verification requirement
        alert("Registration successful! Please check your email to verify your account before logging in.");
        navigate("/login");
      }
    } catch (err) {
      // Handles ApiError (like 'Email already exists' or 'Weak password')
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        <p>Join the Task Manager community</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars, 1 uppercase, 1 symbol)"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Role selection matches your user.controller logic */}
          <div className="role-selection">
            <label>I am a: </label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin (For Testing)</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;