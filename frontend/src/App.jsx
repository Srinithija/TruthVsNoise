import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminPanel from "./pages/AdminPanel.jsx";
import CreateClaim from "./pages/CreateClaim";
import VerifiedRoute from "./routes/VerifiedRoute";
import VotingPage from "./pages/VotingPage";
import ScorePage from "./pages/ScorePage"; // Import the new ScorePage



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={ <AdminRoute><AdminPanel /></AdminRoute>}/>
      <Route path="/create-claim" element={ <VerifiedRoute><CreateClaim /></VerifiedRoute> }/>
      <Route path="/voting" element={<VotingPage />} />
      <Route path="/score" element={<ScorePage />} />

    </Routes>
  );
}

export default App;
