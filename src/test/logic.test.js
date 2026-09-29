import { describe, it, expect } from 'vitest';
import { RESTAURANTS, HOME, FRIENDS } from '../data/seed.js';
import { priceCart } from '../lib/pricing.js';
import { searchSync, suggestForGroupSync, DEFAULT_FILTERS } from '../services/restaurantService.js';
import { leader, pickFor } from '../services/votingService.js';

const tonys = RESTAURANTS.find((r) => r.id === 'tonys');
const cheapestMain = tonys.menuItems.find((m) => m.name === tonys.estimateBasis);

describe('search', () => {
  it('sorts nearby results cheapest first', () => {
    const r = searchSync({ cuisine: 'Pizza', location: HOME });
    expect(r.length).toBeGreaterThan(1);
    const prices = r.map((x) => x.estimatedCostPerPerson);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  it('applies filters', () => {
    const r = searchSync({ cuisine: 'Pizza', location: HOME, filters: { ...DEFAULT_FILTERS, fulfillment: 'delivery', minRating: 4.5 } });
    expect(r.every((x) => x.fulfillmentOptions.includes('delivery') && x.rating >= 4.5)).toBe(true);
  });
});

describe('pricing', () => {
  it('matches the estimate exactly for the cheapest main as carry-out', () => {
    const p = priceCart({ restaurant: tonys, cart: { [cheapestMain.id]: 1 }, fulfillment: 'carryout', estimate: tonys.estimatedCostPerPerson });
    expect(p.total).toBe(tonys.estimatedCostPerPerson);
    expect(p.difference).toBe(0);
    expect(p.withinEstimate).toBe(true);
  });

  it('adds delivery and service fees and shows the difference', () => {
    const p = priceCart({ restaurant: tonys, cart: { [cheapestMain.id]: 1 }, fulfillment: 'delivery', estimate: tonys.estimatedCostPerPerson });
    expect(p.deliveryFee).toBe(2.99);
    expect(p.serviceFee).toBeGreaterThan(0);
    expect(p.difference).toBeCloseTo(p.deliveryFee + p.serviceFee, 2);
    expect(p.withinEstimate).toBe(false);
  });

  it('splits per person and applies the best discount', () => {
    const cart = { [tonys.menuItems[2].id]: 2 };
    const p = priceCart({ restaurant: tonys, cart, fulfillment: 'dinein', partySize: 4, promoCode: 'sjsu10', fromHangout: true, estimate: 5 });
    expect(p.discount.label).toMatch(/SJSU10/);
    expect(p.perPerson).toBeCloseTo(p.total / 4, 2);
  });
});

describe('hangout', () => {
  const me = { id: 'you', name: 'You', prefs: ['Pizza'], location: HOME };
  const group = [me, ...FRIENDS.filter((f) => ['alex', 'sam', 'priya'].includes(f.id))];

  it('suggests 2–3 distinct, cheap options including the host pick', () => {
    const opts = suggestForGroupSync({ participants: group, pinnedId: 'tonys' });
    expect(opts.length).toBeGreaterThanOrEqual(2);
    expect(opts.length).toBeLessThanOrEqual(3);
    expect(opts.some((o) => o.id === 'tonys')).toBe(true);
    expect(new Set(opts.map((o) => o.cuisine)).size).toBe(opts.length);
  });

  it('picks a deterministic winner, ties to the cheaper option', () => {
    const opts = suggestForGroupSync({ participants: group, pinnedId: 'tonys' });
    const votes = Object.fromEntries(group.slice(1).map((f) => [f.id, pickFor(f, opts).id]));
    const w1 = leader(opts, votes);
    const w2 = leader(opts, votes);
    expect(w1.id).toBe(w2.id);
    const tie = { a: opts[0].id, b: opts[1].id };
    expect(leader(opts, tie).id).toBe(opts[0].id); // opts sorted cheapest first
  });
});
