import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext"; // 👈 Don't forget this!

function Login() {
  const { login } = useAuth(); // 👈 Access the login function
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await API.post("/users/login", formData);
      
      if (response.data.success) {
        // Update global state and local storage via context
        login(response.data.data.user); 
        navigate("/dashboard");
      }
    } catch (err) {
      // Backend returns ApiError message
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container"> {/* Updated class to match your App.css */}
      <div className="auth-card">
        <h2>Login to TaskManager</h2>
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="footer-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;