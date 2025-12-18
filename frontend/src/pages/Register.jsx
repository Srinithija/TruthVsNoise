import { useState } from "react";
import "./Register.css";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    domain: "",
    otherDomain: "",
    proof: "",
  });
  
  const navigate = useNavigate(); // Add navigate hook

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error while typing
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    }

    if (!formData.domain) {
      newErrors.domain = "Please select a domain";
    }

    if (formData.domain === "other" && !formData.otherDomain.trim()) {
      newErrors.otherDomain = "Please enter your domain";
    }

    if (formData.proof) {
      try {
        new URL(formData.proof);
      } catch {
        newErrors.proof = "Enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const finalData = {
      ...formData,
      domain:
        formData.domain === "other"
          ? formData.otherDomain
          : formData.domain,
    };

    try {
      const response = await registerUser(finalData);
      alert(response.data.message);
      console.log("Registered:", response.data);
      
      // After successful registration, redirect to login
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left */}
      <div className="register-left">
        <h1>Truth vs Noise</h1>
        <p>
          Join a credibility-weighted community where facts are evaluated by
          expertise, not popularity.
        </p>
      </div>

      {/* Right */}
      <div className="register-right">
        <form
          className="register-card"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2>Create Account</h2>
          <p>Register to start evaluating claims</p>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="input-group">
            <label>Role / Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            />
            {errors.profession && (
              <span className="error">{errors.profession}</span>
            )}
          </div>

          <div className="input-group">
            <label>Domain of Expertise</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
            >
              <option value="">Select domain</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="politics">Politics</option>
              <option value="science">Science</option>
             
              <option value="other">Other</option>
            </select>
            {errors.domain && <span className="error">{errors.domain}</span>}

            {formData.domain === "other" && (
              <>
                <input
                  type="text"
                  name="otherDomain"
                  placeholder="Enter your domain"
                  value={formData.otherDomain}
                  onChange={handleChange}
                />
                {errors.otherDomain && (
                  <span className="error">{errors.otherDomain}</span>
                )}
              </>
            )}
          </div>

          <div className="input-group">
            <label>Credibility Proof (URL)</label>
            <input
              type="text"
              name="proof"
              value={formData.proof}
              onChange={handleChange}
            />
            {errors.proof && <span className="error">{errors.proof}</span>}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="footer-text">
            Already have an account?{" "}
            <Link to="/" className="login-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;