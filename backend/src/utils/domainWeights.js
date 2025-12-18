// How much a user's expertise transfers to other domains
module.exports = {
  health: {
    health: 1.0,
    science: 0.6,
    technology: 0.4,
    politics: 0.1
  },
  science: {
    science: 1.0,
    health: 0.7,
    technology: 0.6,
    politics: 0.2
  },
  technology: {
    technology: 1.0,
    science: 0.6,
    health: 0.4,
    politics: 0.3
  },
  politics: {
    politics: 1.0,
    health: 0.1,
    science: 0.2,
    technology: 0.3
  }
};
