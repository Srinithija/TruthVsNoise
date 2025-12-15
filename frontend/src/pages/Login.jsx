import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const navigate = useNavigate(); // ✅ useNavigate hook

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    // ✅ STORE TOKEN AND ROLE
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);

    // Redirect to dashboard
    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    alert(error?.response?.data?.message || "Login failed. Check email or password");
  }
};


  return (
    <div className="login-container">
      {/* Left Branding Section */}
      <div className="login-left">
        <h1>Truth vs Noise</h1>
        <p>
          A credibility-weighted community platform to evaluate facts,
          filter misinformation, and amplify truth.
        </p>
      </div>

      {/* Right Login Section */}
      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome Back 👋</h2>
          <p>Please login to continue</p>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

         <p className="footer-text">
  Don’t have an account?{" "}
  <Link to="/register" className="register-link">
    Register
  </Link>
</p>

        </form>
      </div>
    </div>
  );
};

export default Login;
