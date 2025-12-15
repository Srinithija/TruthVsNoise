import { useEffect, useState } from "react";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/verifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data.pending))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Verification Panel 👮</h1>

      {users.length === 0 ? (
        <p>No pending verifications</p>
      ) : (
        users.map(user => (
          <div key={user._id} className="admin-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Profession: {user.profession}</p>

            {user.proofURL && (
              <a href={user.proofURL} target="_blank" rel="noreferrer">
                View Proof
              </a>
            )}

            <div className="admin-actions">
              <button className="approve">Approve</button>
              <button className="reject">Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPanel;
