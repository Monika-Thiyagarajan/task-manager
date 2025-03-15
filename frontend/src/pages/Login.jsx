import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // Create this file similar to signup.css

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Used for redirection

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", response.data.token); // Store JWT in localStorage
      setMessage("Login successful!");
      navigate("/tasks"); // Redirect to Tasks page
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input className="input-field" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
          <input className="input-field" type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
