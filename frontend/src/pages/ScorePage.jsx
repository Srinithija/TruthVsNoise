import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import Navigation from "../components/Navigation"; // Import the navigation
import "../styles/ScorePage.css";

const ScorePage = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimDetails, setClaimDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get role from localStorage
  const role = localStorage.getItem("role");

  // Fetch all claims
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await API.get("/claims");
        setClaims(response.data);
      } catch (err) {
        setError("Failed to fetch claims");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Fetch detailed information for a selected claim
  useEffect(() => {
    const fetchClaimDetails = async () => {
      if (!selectedClaim) {
        setClaimDetails(null);
        return;
      }

      try {
        setLoading(true);
        const response = await API.get(`/votes/details/${selectedClaim._id}`);
        setClaimDetails(response.data);
      } catch (err) {
        setError("Failed to fetch claim details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [selectedClaim]);

  const handleClaimSelect = (claim) => {
    setSelectedClaim(claim);
  };

  const renderVoteChart = (rawStats, weightedStats) => {
    if (!rawStats || !weightedStats) return null;

    const rawTruePercent = rawStats.total > 0 ? Math.round((rawStats.true / rawStats.total) * 100) : 0;
    const rawFalsePercent = rawStats.total > 0 ? Math.round((rawStats.false / rawStats.total) * 100) : 0;
    const rawUnsurePercent = rawStats.total > 0 ? Math.round((rawStats.unsure / rawStats.total) * 100) : 0;

    const weightedTruePercent = weightedStats.total > 0 ? Math.round((weightedStats.true / weightedStats.total) * 100) : 0;
    const weightedFalsePercent = weightedStats.total > 0 ? Math.round((weightedStats.false / weightedStats.total) * 100) : 0;
    const weightedUnsurePercent = weightedStats.total > 0 ? Math.round((weightedStats.unsure / weightedStats.total) * 100) : 0;

    return (
      <div className="vote-charts">
        <div className="chart-section">
          <h3>Raw Votes (Popularity)</h3>
          <div className="chart-bar">
            <div className="chart-label">TRUE: {rawTruePercent}% ({rawStats.true})</div>
            <div className="progress-bar">
              <div 
                className="progress-segment raw-true" 
                style={{ width: `${rawTruePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="chart-bar">
            <div className="chart-label">FALSE: {rawFalsePercent}% ({rawStats.false})</div>
            <div className="progress-bar">
              <div 
                className="progress-segment raw-false" 
                style={{ width: `${rawFalsePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="chart-bar">
            <div className="chart-label">UNSURE: {rawUnsurePercent}% ({rawStats.unsure})</div>
            <div className="progress-bar">
              <div 
                className="progress-segment raw-unsure" 
                style={{ width: `${rawUnsurePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="total-voters">Total Voters: {rawStats.total}</div>
        </div>

        <div className="chart-section">
          <h3>Weighted Votes (Expertise)</h3>
          <div className="chart-bar">
            <div className="chart-label">TRUE: {weightedTruePercent}% ({weightedStats.true.toFixed(2)})</div>
            <div className="progress-bar">
              <div 
                className="progress-segment weighted-true" 
                style={{ width: `${weightedTruePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="chart-bar">
            <div className="chart-label">FALSE: {weightedFalsePercent}% ({weightedStats.false.toFixed(2)})</div>
            <div className="progress-bar">
              <div 
                className="progress-segment weighted-false" 
                style={{ width: `${weightedFalsePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="chart-bar">
            <div className="chart-label">UNSURE: {weightedUnsurePercent}% ({weightedStats.unsure.toFixed(2)})</div>
            <div className="progress-bar">
              <div 
                className="progress-segment weighted-unsure" 
                style={{ width: `${weightedUnsurePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="total-voters">Total Weight: {weightedStats.total.toFixed(2)}</div>
        </div>
      </div>
    );
  };

  const renderVoterList = (votes) => {
    if (!votes || votes.length === 0) return <p>No votes yet</p>;

    return (
      <div className="voter-list">
        <h3>Voters Breakdown</h3>
        <table className="voter-table">
          <thead>
            <tr>
              <th>Voter</th>
              <th>Profession</th>
              <th>Vote</th>
              <th>Credibility Used</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, index) => (
              <tr key={index}>
                <td>{vote.voter.name}</td>
                <td>{vote.voter.profession}</td>
                <td className={`vote-${vote.vote}`}>{vote.vote.toUpperCase()}</td>
                <td>{vote.credibilityUsed}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="score-page">
      {/* Add the navigation to all pages */}
      <Navigation role={role} />
      
      <div className="page-header">
        <h1>📊 Credibility Score Dashboard</h1>
        <p>Compare raw votes vs credibility-weighted votes</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-layout">
        {/* Claims List */}
        <div className="claims-section">
          <h2>Claims Evaluation</h2>
          {loading && !claims.length && <p>Loading claims...</p>}
          
          <div className="claims-list">
            {claims.map((claim) => (
              <div 
                key={claim._id}
                className={`claim-item ${selectedClaim?._id === claim._id ? "selected" : ""}`}
                onClick={() => handleClaimSelect(claim)}
              >
                <div className="claim-header">
                  <h3>{claim.title}</h3>
                  <span className={`domain-tag ${claim.domain}`}>
                    {claim.domain}
                  </span>
                </div>
                <p className="claim-description">{claim.description.substring(0, 100)}...</p>
                <div className="claim-meta">
                  <span className={`verdict-badge ${claim.verdict || "CONTESTED"}`}>
                    {claim.verdict || "CONTESTED"}
                  </span>
                  <span>Score: {claim.finalTruthScore || 50}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claim Details */}
        <div className="details-section">
          {selectedClaim ? (
            <div className="claim-details">
              <div className="detail-header">
                <h2>{selectedClaim.title}</h2>
                <div className="detail-tags">
                  <span className={`domain-tag ${selectedClaim.domain}`}>
                    {selectedClaim.domain}
                  </span>
                  <span className="status-badge">{selectedClaim.status}</span>
                </div>
              </div>
              
              <p className="detail-description">{selectedClaim.description}</p>
              
              {loading && !claimDetails ? (
                <p>Loading details...</p>
              ) : claimDetails ? (
                <div className="detail-content">
                  <div className="stats-summary">
                    <h3>📊 Voting Statistics</h3>
                    <div className="final-score">
                      <h4>Final Truth Score: {claimDetails.stats.finalTruthScore}%</h4>
                      <div className={`verdict ${claimDetails.stats.verdict}`}>
                        Verdict: {claimDetails.stats.verdict}
                      </div>
                    </div>
                  </div>

                  {renderVoteChart(claimDetails.stats.raw, claimDetails.stats.weighted)}

                  <div className="difference-analysis">
                    <h3>🔍 Analysis</h3>
                    <div className="analysis-content">
                      <p>
                        <strong>Raw Votes:</strong> Each vote counts as 1, showing pure popularity.
                      </p>
                      <p>
                        <strong>Weighted Votes:</strong> Votes are weighted by domain expertise, showing expert consensus.
                      </p>
                      {Math.abs(claimDetails.stats.raw.true / (claimDetails.stats.raw.total || 1) * 100 - 
                                claimDetails.stats.weighted.true / (claimDetails.stats.weighted.total || 1) * 100) > 10 && (
                        <div className="insight-box">
                          💡 Expertise significantly shifted the outcome
                        </div>
                      )}
                    </div>
                  </div>

                  {renderVoterList(claimDetails.votes)}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="no-selection">
              <h3>Select a claim to view detailed analysis</h3>
              <p>Click on any claim from the list to see voting statistics, detailed voter breakdown, and comparison between raw and weighted votes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScorePage;