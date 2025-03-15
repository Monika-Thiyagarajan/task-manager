import { useState } from "react";
import axios from "axios";
import "../styles/signup.css"; // Keep styles

function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage("Signup successful! Please log in.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input className="input-field" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
          <input className="input-field" type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
          <button className="signup-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
