import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/CreateClaim.css";
import API from "../api/api";

const CreateClaim = () => {
  const navigate = useNavigate();

  // ✅ Declare role ONLY ONCE

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    attachments: ""
  });

  const [loading, setLoading] = useState(false);
const name = localStorage.getItem("name");
const profession = localStorage.getItem("profession");
  const role = localStorage.getItem("role"); // Get role from localStorage


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("profession");
    window.location.href = "/";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        attachments: formData.attachments
          ? [formData.attachments]
          : []
      };

      await API.post("/claims", payload);
      alert("✅ Claim submitted successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Claim submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-claim-page">
      {/* ✅ NAVIGATION */}
      <nav className="dashboard-nav">
        <h2>Truth vs Noise</h2>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/create-claim" className="nav-link active">Create Claim</Link>
          <Link to="/voting" className="nav-link">Voting</Link>
          <Link to="/score" className="nav-link">Scoring</Link>
        </div>

        <div className="nav-right">
          <div className="user-info">
            <span className="user-name">{name || "User"}</span>
            <span className="user-profession">{profession || "Member"}</span>
          </div>
          <span className="role-badge">
            {role === "admin" ? "Admin" : "User"}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ CREATE CLAIM FORM */}
      <div className="claim-page">
        <div className="claim-card">
          <h1>Submit a Claim 📝</h1>
          <p className="subtitle">
            Provide accurate information and reliable proof.
          </p>

          <form onSubmit={handleSubmit} className="claim-form">
            <input
              type="text"
              name="title"
              placeholder="Claim Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Claim Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              required
            >
              <option value="">Select Domain</option>
              <option value="health">Health</option>
              <option value="technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="science">Science</option>
            </select>

            <input
              type="url"
              name="attachments"
              placeholder="Proof URL (optional)"
              value={formData.attachments}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClaim;
