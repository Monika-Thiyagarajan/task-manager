import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; 
import lemonpayLogo from "../assets/lemonpaylogo.png"; // Import the logo

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" }); 
  const navigate = useNavigate();

  // Validate email
  const validateEmail = (email) => {
    if (!email) return "Please fill this field.";
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email) ? "" : "Please enter a valid email.";
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) return "Please fill this field.";
    return password.length >= 8 ? "" : "Password must be at least 8 characters.";
  };

  // Handle input changes and validation while typing
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate while typing
    let errorMsg = "";
    if (name === "email") errorMsg = validateEmail(value);
    if (name === "password") errorMsg = validatePassword(value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate before submitting
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
  
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      setMessage({ text: "Login successful!", type: "success" }); // Success message
      navigate("/tasks");
    } catch (error) {
      setMessage({ text: error.response?.data?.error || "Login failed", type: "error" }); // Error message
    }
  };

  return (
    <div class="login-container">
      {/* Left side */}
      <div class="login-left">
        <img src={lemonpayLogo} alt="LemonPay Logo" class="logo" />
        <div class="left-text">
          <h4>Join 8 Million Businesses</h4>
          <h4 class="highlight-text">Powering Growth with</h4>
          <h4>Lemonpay!</h4>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div class="login-right">
        <div class="login-box">
          <h2>Welcome to the Login System</h2>
          <p>Your gateway to seamless transactions and easy payments.</p>
          {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <input
              class={`input-field ${errors.email ? 'invalid' : ''}`}
              type="email"
              name="email"
              placeholder="mahadev@lemonpay.tech"
              value={formData.email}
              onInput={handleInput}
              required
            />
             <div class="error-text">{errors.email}</div> 
            
            {/* Password Input */}
            <input
              class={`input-field ${errors.password ? 'invalid' : ''}`}
              type="password"
              name="password"
              placeholder="Min 8 characters"
              value={formData.password}
              onInput={handleInput}
              required
            />
            <div class="error-text">{errors.password}</div>

            {/* Options row */}
            <div class="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="/signup">Sign up</a>
            </div>

            <button class="login-btn" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
