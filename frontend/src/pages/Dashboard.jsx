import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const role = localStorage.getItem("role"); // "admin" or "user"

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-nav">
        <h2>Truth vs Noise</h2>
        <div className="nav-right">
          <span className="role-badge">
            {role === "admin" ? "Admin" : "User"}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Welcome 👋</h1>
        <p className="subtitle">
          Evaluate claims, vote responsibly, and help separate truth from noise.
        </p>

        {/* Action Cards */}
        <div className="card-grid">
          {/* Submit Claim */}
          <Link to="/create-claim" className="dashboard-card">
            <h3>📝 Submit a Claim</h3>
            <p>Post a claim for community evaluation.</p>
          </Link>

          {/* Community Voting */}
          <Link to="/claims" className="dashboard-card">
            <h3>🗳 Community Voting</h3>
            <p>Vote on claims using credibility-weighted logic.</p>
          </Link>

          {/* Credibility Score */}
          <Link to="/score" className="dashboard-card">
            <h3>📊 Credibility Score</h3>
            <p>View truth vs noise breakdown.</p>
          </Link>

          {/* Admin Panel – ONLY ADMIN */}
          {role === "admin" ? (
            <Link to="/admin" className="dashboard-card admin-card">
              <h3>👮 Admin Panel</h3>
              <p>Verify users and manage credibility.</p>
            </Link>
          ) : (
            <div className="dashboard-card disabled">
              <h3>👮 Admin Panel</h3>
              <p>Only accessible to admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
