import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import "../styles/signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


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

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, formData);

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div class="signup-container">
      <h2>Create Your Account</h2>
      <p>Join LemonPay and start managing your payments effortlessly.</p>
      {message && <p class="message">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <input
          class={`input-field ${errors.email ? 'invalid' : ''}`}
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onInput={handleInput}
          required
        />
        {errors.email && <p class="error-text-signup">{errors.email}</p>}
        
        {/* Password Input */}
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
        {errors.password && <p class="error-text-signup">{errors.password}</p>}

        <button class="signup-btn" type="submit">Sign Up</button>
      </form>

      {/* Already have an account? */}
      <p class="login-link">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}

export default Signup;
