import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
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

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-nav">
  <h2>Truth vs Noise</h2>
  <div className="nav-links">
    <Link to="/dashboard" className="nav-link">Dashboard</Link>
    <Link to="/create-claim" className="nav-link">Create Claim</Link>
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
          <Link to="/voting" className="dashboard-card">
            <h3>🗳 Community Voting</h3>
            <p>Vote on claims using credibility-weighted logic.</p>
          </Link>

          {/* Credibility Score */}
          <Link to="/score" className="dashboard-card">
            <h3>📊 Credibility Score</h3>
            <p>View truth vs noise breakdown.</p>
          </Link>
          
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
