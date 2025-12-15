import { useState } from "react";
import "../styles/CreateClaim.css";

const CreateClaim = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    attachments: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/claims", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    alert(data.message || "Claim submitted");
  };

  return (
    <div className="claim-container">
      <h1>Submit a Claim 📝</h1>

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

        <button type="submit">Submit Claim</button>
      </form>
    </div>
  );
};

export default CreateClaim;
