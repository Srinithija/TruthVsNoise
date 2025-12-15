import { Navigate } from "react-router-dom";

const VerifiedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isVerified = localStorage.getItem("isVerified") === "true";
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (role === "admin" || isVerified) return children;

  return <Navigate to="/dashboard" replace />;
};

export default VerifiedRoute;
