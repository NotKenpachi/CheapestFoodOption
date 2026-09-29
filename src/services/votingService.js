import { config } from './config.js';

/** Which option a simulated friend votes for: their favorite cuisine first, then the cheaper place. */
export function pickFor(participant, options) {
  const rank = (o) => {
    const i = participant.prefs.indexOf(o.cuisine);
    return i === -1 ? 99 : i;
  };
  return [...options].sort((a, b) => rank(a) - rank(b) || a.estimatedCostPerPerson - b.estimatedCostPerPerson)[0];
}

/** Winner by votes; ties go to the cheaper option. */
export function leader(options, votes) {
  const tally = tallyVotes(options, votes);
  return [...options].sort(
    (a, b) => tally[b.id] - tally[a.id] || a.estimatedCostPerPerson - b.estimatedCostPerPerson
  )[0];
}

export function tallyVotes(options, votes) {
  const t = Object.fromEntries(options.map((o) => [o.id, 0]));
  Object.values(votes).forEach((id) => {
    if (id in t) t[id] += 1;
  });
  return t;
}

/**
 * Simulates friends voting in real time. In production this would be a
 * websocket/realtime subscription; here each friend votes on a fixed
 * schedule so the demo is identical every run.
 * Returns a function that cancels the pending votes.
 */
export function startVoteSimulation({ friends, options, onVote }) {
  const timers = friends.map((f, i) =>
    setTimeout(() => onVote(f.id, pickFor(f, options).id), config.voteDelaysMs[i % config.voteDelaysMs.length])
  );
  return () => timers.forEach(clearTimeout);
}
