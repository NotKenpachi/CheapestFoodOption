// Tunables for the mock service layer. Tests shrink these to run fast.
export const config = {
  latencyMs: 350, // simulated network latency for mock API calls
  voteDelaysMs: [1400, 2600, 3700, 4900, 6000, 7200], // when each simulated friend votes
};

export const wait = (ms = config.latencyMs) =>
  new Promise((resolve) => (ms > 0 ? setTimeout(resolve, ms) : resolve()));
