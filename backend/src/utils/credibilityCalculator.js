// src/utils/credibilityCalculator.js
// returns credibility (0..1) from user object for given domain
exports.getCredibilityForDomain = (user, domain) => {
  if (!user) return 0.0;
  // user.domainCredibility expected as [{domain, score}] where score 0..100
  if (Array.isArray(user.domainCredibility)) {
    const d = user.domainCredibility.find(x => x.domain.toLowerCase() === domain.toLowerCase());
    if (d) return Math.min(Math.max(d.score / 100, 0), 1); // normalize to 0..1
  }
  // fallback to baseCredibility default (0..100) -> normalize
  if (user.baseCredibility !== undefined) {
    return Math.min(Math.max(user.baseCredibility / 100, 0), 1);
  }
  return 0.3; // absolute fallback
};
