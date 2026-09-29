import { RESTAURANTS, FRIENDS } from '../data/seed.js';
import { distanceMiles, travelTime, centroid } from '../lib/geo.js';
import { wait } from './config.js';

export const DEFAULT_FILTERS = { maxPrice: 20, maxDistance: 3, minRating: 0, fulfillment: 'any' };

function withTravel(r, from) {
  const miles = distanceMiles(from, r.location);
  return { ...r, distanceMiles: miles, travel: travelTime(miles) };
}

const byCost = (a, b) =>
  a.estimatedCostPerPerson - b.estimatedCostPerPerson || a.distanceMiles - b.distanceMiles;

/** Synchronous core, used by the async API and by tests. */
export function searchSync({ cuisine, location, filters = DEFAULT_FILTERS }) {
  return RESTAURANTS.filter((r) => !cuisine || r.cuisine === cuisine)
    .map((r) => withTravel(r, location))
    .filter((r) => r.estimatedCostPerPerson <= filters.maxPrice)
    .filter((r) => r.distanceMiles <= filters.maxDistance)
    .filter((r) => r.rating >= filters.minRating)
    .filter((r) => filters.fulfillment === 'any' || r.fulfillmentOptions.includes(filters.fulfillment))
    .sort(byCost);
}

/** Mock "API": nearby restaurants for a cuisine, cheapest first. */
export async function searchRestaurants(params) {
  await wait();
  return searchSync(params);
}

export function getRestaurant(id, location) {
  const r = RESTAURANTS.find((x) => x.id === id);
  return r && location ? withTravel(r, location) : r;
}

/** Cheapest estimate per cuisine near a location (for the cuisine picker). */
export function cuisineSummary(location) {
  const out = {};
  for (const r of RESTAURANTS) {
    if (distanceMiles(location, r.location) > DEFAULT_FILTERS.maxDistance) continue;
    const s = (out[r.cuisine] ||= { count: 0, from: Infinity });
    s.count += 1;
    s.from = Math.min(s.from, r.estimatedCostPerPerson);
  }
  return out;
}

export function getFriends() {
  return FRIENDS;
}

/**
 * Suggest 2–3 restaurants for a group:
 *  - close to the group's midpoint (within 3 mi),
 *  - matching as many participants' cuisine preferences as possible,
 *  - cheapest first among equally good matches.
 * The restaurant the host started from is always kept as one option.
 */
export function suggestForGroupSync({ participants, pinnedId }) {
  const mid = centroid(participants.map((p) => p.location));
  const scored = RESTAURANTS.map((r) => {
    const r2 = withTravel(r, mid);
    const fans = participants.filter((p) => p.prefs.includes(r.cuisine));
    return { ...r2, fans: fans.map((f) => f.id), matchCount: fans.length };
  }).filter((r) => r.distanceMiles <= 3);

  const pinned = scored.find((r) => r.id === pinnedId);
  const ranked = scored
    .filter((r) => r.id !== pinnedId && r.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount || a.estimatedCostPerPerson - b.estimatedCostPerPerson);

  const picks = pinned ? [pinned] : [];
  const cuisinesUsed = new Set(picks.map((p) => p.cuisine));
  for (const r of ranked) {
    if (picks.length >= 3) break;
    if (cuisinesUsed.has(r.cuisine)) continue; // keep the choices distinct
    picks.push(r);
    cuisinesUsed.add(r.cuisine);
  }
  return picks.sort((a, b) => a.estimatedCostPerPerson - b.estimatedCostPerPerson);
}

export async function suggestForGroup(params) {
  await wait();
  return suggestForGroupSync(params);
}
