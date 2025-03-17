import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css"; 
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import lemonpayLogo from "../assets/lemonpaylogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email in real-time
  const validateEmail = (email) => {
    if (!email) return "Please fill this field.";
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email) ? "" : "Please enter a valid email.";
  };

  // Validate password in real-time
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

    // Clear alert message on typing
    setMessage({ text: "", type: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Final validation before submitting
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setMessage({ text: "Please fix errors before submitting.", type: "danger" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        { timeout: 5000 }
      );
      localStorage.setItem("token", response.data.token);
      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => navigate("/tasks"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage({ text: error.response?.data?.error || "Login failed", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side */}
      <div className="login-left">
        <img src={lemonpayLogo} alt="LemonPay Logo" className="logo" />
        <div className="left-text">
          <h4>Join 8 Million Businesses</h4>
          <h4 className="highlight-text">Powering Growth with</h4> &nbsp;
          <h4>Lemonpay!</h4>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome to the Login System</h2>
          <p>Your gateway to seamless transactions and easy payments.</p>

          {/* Bootstrap Alert for Errors */}
          {message.text && (
            <div className={`alert alert-${message.type} text-center`} role="alert">
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <input
              className={`input-field ${errors.email ? "invalid" : ""}`}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onInput={handleInput}
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}

            {/* Password Input with Eye Icon */}
            <div className="input-wrapper">
              <input
                className={`input-field ${errors.password ? "invalid" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min 8 characters"
                value={formData.password}
                onInput={handleInput}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <div className="error-text">{errors.password}</div>}

            {/* Options row */}
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/signup">Sign up</Link>
            </div>

            {/* Login Button with Loading State */}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
