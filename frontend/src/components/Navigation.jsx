// frontend/src/components/Navigation.jsx
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

const Navigation = ({ role }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <nav className="top-navigation">
      <div className="nav-brand">
        <Link to="/dashboard">Truth vs Noise</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/create-claim" className="nav-link">Create Claim</Link>
        <Link to="/voting" className="nav-link">Voting</Link>
        <Link to="/score" className="nav-link">Scoring</Link>
        {role === "admin" && (
          <Link to="/admin" className="nav-link">Admin</Link>
        )}
      </div>
      
      <div className="nav-right">
        <span className="role-badge">
          {role === "admin" ? "Admin" : "User"}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;