const domainWeights = require("./domainWeights");

// returns credibility (0..1)
exports.getCredibilityForDomain = (user, claimDomain) => {
  if (!user ) return 0.0;

  claimDomain = claimDomain.toLowerCase();

  // user.domainCredibility: [{ domain, score }]
  if (!Array.isArray(user.domainCredibility)) {
    return Math.min(user.baseCredibility / 100, 1);
  }

  let finalWeight = 0;

  for (const d of user.domainCredibility) {
    const userDomain = d.domain.toLowerCase();
    const userScore = Math.min(Math.max(d.score / 100, 0), 1);

    // Check cross-domain relevance
    const multiplier =
      domainWeights[userDomain]?.[claimDomain] ?? 0;

    const weightedScore = userScore * multiplier;

    finalWeight = Math.max(finalWeight, weightedScore);
  }

  // fallback to base credibility (low influence)
  if (finalWeight === 0) {
    finalWeight = Math.min(user.baseCredibility / 100, 0.3);
  }

  return Number(finalWeight.toFixed(2));
};
