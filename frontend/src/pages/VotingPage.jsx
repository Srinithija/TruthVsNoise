import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // ← Added missing import
import API from "../api/api";
import "../styles/Voting.css";

const Voting = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [results, setResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
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

  // Fetch all claims on mount
  useEffect(() => {
    API.get("/claims")
      .then((res) => setClaims(res.data))
      .catch((err) => {
        console.error("Failed to load claims:", err);
        alert("Failed to load claims.");
      });
  }, []);

  // Fetch vote results when a claim is selected
  useEffect(() => {
    if (!selectedClaim) {
      setResults(null);
      return;
    }
    API.get(`/votes/results/${selectedClaim._id}`)
      .then((res) => setResults(res.data))
      .catch((err) => {
        console.error("Failed to load results:", err);
      });
  }, [selectedClaim]);

  // Handle voting
  const onVote = async (voteValue) => {
    if (!selectedClaim || loading || hasVoted) return;

    setLoading(true);
    try {
      await API.post(`/votes/${selectedClaim._id}`, { vote: voteValue });
      setHasVoted(true);

      // Refresh results after successful vote
      const res = await API.get(`/votes/results/${selectedClaim._id}`);
      setResults(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Vote failed";
      if (msg.toLowerCase().includes("already voted")) {
        setHasVoted(true);
      }
      alert(msg);

      // Still try to fetch latest results even if vote failed
      try {
        const res = await API.get(`/votes/results/${selectedClaim._id}`);
        setResults(res.data);
      } catch (fetchErr) {
        console.error("Could not refresh results after error:", fetchErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Compute percentages and insights
  const computed = useMemo(() => {
    if (!results) return null;

    const rawTrue = results.rawVotes?.trueVotes || 0;
    const rawFalse = results.rawVotes?.falseVotes || 0;
    const rawUnsure = results.rawVotes?.unsureVotes || 0;
    const rawTotal = rawTrue + rawFalse + rawUnsure;

    const rawTruePct = rawTotal ? Math.round((rawTrue / rawTotal) * 100) : 0;
    const rawFalsePct = rawTotal ? Math.round((rawFalse / rawTotal) * 100) : 0;
    const rawUnsurePct = rawTotal ? Math.round((rawUnsure / rawTotal) * 100) : 0;

    const wTrue = results.weightedVotes?.trueWeight || 0;
    const wFalse = results.weightedVotes?.falseWeight || 0;
    const wUnsure = results.weightedVotes?.unsureWeight || 0;
    const wTotal = wTrue + wFalse + wUnsure;

    const wTruePct = wTotal ? Math.round((wTrue / wTotal) * 100) : 0;
    const wFalsePct = wTotal ? Math.round((wFalse / wTotal) * 100) : 0;
    const wUnsurePct = wTotal ? Math.round((wUnsure / wTotal) * 100) : 0;

    const shift = Math.abs(wTruePct - rawTruePct);

    return {
      raw: { true: rawTruePct, false: rawFalsePct, unsure: rawUnsurePct, total: rawTotal },
      weighted: {
        true: wTruePct,
        false: wFalsePct,
        unsure: wUnsurePct,
        total: wTotal,
        score: results.finalTruthScore ?? 0,
      },
      verdict: results.verdict || "Pending",
      shift,
    };
  }, [results]);

  return (
    <div className="voting-page-wrapper">
      {/* ✅ NAVIGATION */}
      <nav className="dashboard-nav">
        <h2>Truth vs Noise</h2>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/create-claim" className="nav-link">
            Create Claim
          </Link>
          <Link to="/voting" className="nav-link active">
            Voting
          </Link>
          <Link to="/score" className="nav-link">
            Scoring
          </Link>
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

      <div className="voting-page">
        <h1>🗳 Community Voting</h1>
        <p className="subtitle">Compare popularity vs expertise</p>

        <div className="claim-list">
          {claims.length === 0 ? (
            <p>No claims available for voting.</p>
          ) : (
            claims.map((c) => (
              <div
                key={c._id}
                className={`claim-card ${selectedClaim?._id === c._id ? "active" : ""}`}
                onClick={() => {
                  setSelectedClaim(c);
                  setHasVoted(false);
                  setResults(null); // Reset results when switching claim
                }}
              >
                <div className="card-top">
                  <span className="domain">{c.domain}</span>
                  <span className={`status ${c.status}`}>
                    {c.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>
                <h3>{c.title}</h3>
                <p className="author">by {c.author?.name || "Unknown"}</p>
                {c.attachments?.[0] && (
                  <a href={c.attachments[0]} target="_blank" rel="noreferrer">
                    View Proof
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        {selectedClaim && (
          <div className="detail">
            <div className="detail-header">
              <div>
                <h2>{selectedClaim.title}</h2>
                <p>{selectedClaim.description || "No description provided."}</p>
              </div>
              <div className="badges">
                <span className="domain">{selectedClaim.domain}</span>
                <span className={`status ${selectedClaim.status}`}>
                  {selectedClaim.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
            </div>

            <div className="vote-actions">
              <button
                disabled={loading || hasVoted}
                onClick={() => onVote("true")}
                className="vote-btn true"
              >
                {loading ? "Voting..." : "✅ TRUE"}
              </button>
              <button
                disabled={loading || hasVoted}
                onClick={() => onVote("false")}
                className="vote-btn false"
              >
                {loading ? "Voting..." : "❌ FALSE"}
              </button>
              <button
                disabled={loading || hasVoted}
                onClick={() => onVote("unsure")}
                className="vote-btn unsure"
              >
                {loading ? "Voting..." : "🤔 UNSURE"}
              </button>
            </div>

            {hasVoted && !loading && (
              <p className="voted-message">✅ You have already voted on this claim.</p>
            )}

            {results && computed && (
              <>
                <div className="results">
                  <div className="panel">
                    <h3>Raw Votes (Popularity)</h3>
                    <div className="bar">
                      <div
                        className="bar-segment raw true"
                        style={{ width: `${computed.raw.true}%` }}
                      >
                        {computed.raw.true}% TRUE
                      </div>
                    </div>
                    <div className="bar">
                      <div
                        className="bar-segment raw false"
                        style={{ width: `${computed.raw.false}%` }}
                      >
                        {computed.raw.false}% FALSE
                      </div>
                    </div>
                    <div className="bar">
                      <div
                        className="bar-segment raw unsure"
                        style={{ width: `${computed.raw.unsure}%` }}
                      >
                        {computed.raw.unsure}% UNSURE
                      </div>
                    </div>
                    <div className="legend">
                      Every vote counts equally • Voters: {computed.raw.total}
                    </div>
                  </div>

                  <div className="panel">
                    <h3>Weighted Votes (Expertise)</h3>
                    <div className="bar">
                      <div
                        className="bar-segment weighted true"
                        style={{ width: `${computed.weighted.true}%` }}
                      >
                        {computed.weighted.true}% TRUE
                      </div>
                    </div>
                    <div className="bar">
                      <div
                        className="bar-segment weighted false"
                        style={{ width: `${computed.weighted.false}%` }}
                      >
                        {computed.weighted.false}% FALSE
                      </div>
                    </div>
                    <div className="bar">
                      <div
                        className="bar-segment weighted unsure"
                        style={{ width: `${computed.weighted.unsure}%` }}
                      >
                        {computed.weighted.unsure}% UNSURE
                      </div>
                    </div>
                    <div className="legend">
                      Only verified experts • Total weight: {computed.weighted.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {computed.shift > 10 && (
                  <div className="insight">
                    💡 Expertise shifted the outcome by {computed.shift}% • Final Verdict:{" "}
                    <strong>{computed.verdict}</strong>
                  </div>
                )}

                <div className="final">
                  Final Truth Score: <strong>{computed.weighted.score}%</strong> • Verdict:{" "}
                  <strong>{computed.verdict}</strong>
                </div>

                <div className="comparison-text">
                  <p>
                    "{computed.raw.true}% of all users believe this claim is TRUE,
                  </p>
                  <p>
                    but <strong>{computed.weighted.true}% of domain experts</strong> believe it is
                    TRUE."
                  </p>
                  <p>Trust the weighted result for expert consensus.</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;