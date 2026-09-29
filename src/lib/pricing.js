import { TAX_RATE, round2 } from '../data/seed.js';

export const PROMO_CODES = {
  SJSU10: { label: 'SJSU10 · 10% off food', rate: 0.1 },
};
export const GROUP_DEAL = { label: 'Hangout group deal · 5% off food', rate: 0.05, minParty: 3 };

/**
 * Price a cart. Everything the checkout shows comes from here, so the
 * running total and the comparison against the "cheapest" estimate always agree.
 */
export function priceCart({ restaurant, cart, fulfillment, partySize = 1, promoCode = '', fromHangout = false, estimate }) {
  const lines = restaurant.menuItems
    .filter((m) => cart[m.id] > 0)
    .map((m) => ({ ...m, qty: cart[m.id], lineTotal: round2(m.price * cart[m.id]) }));
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));

  const discounts = [];
  const promo = PROMO_CODES[promoCode.trim().toUpperCase()];
  if (promo) discounts.push({ label: promo.label, amount: round2(subtotal * promo.rate) });
  if (fromHangout && partySize >= GROUP_DEAL.minParty)
    discounts.push({ label: GROUP_DEAL.label, amount: round2(subtotal * GROUP_DEAL.rate) });
  // Discounts don't stack: the best one applies.
  const discount = discounts.sort((a, b) => b.amount - a.amount)[0] || null;
  const discountAmount = discount ? discount.amount : 0;

  const isDelivery = fulfillment === 'delivery' && itemCount > 0;
  const deliveryFee = isDelivery ? restaurant.fees.delivery || 0 : 0;
  const serviceFee = isDelivery ? round2(subtotal * restaurant.fees.deliveryServiceRate) : 0;
  const tax = round2((subtotal - discountAmount) * TAX_RATE);
  const total = round2(subtotal - discountAmount + deliveryFee + serviceFee + tax);
  const party = Math.max(1, partySize);
  const perPerson = round2(total / party);
  const difference = estimate != null ? round2(perPerson - estimate) : null;

  return {
    lines, itemCount, subtotal, discount, discountAmount, deliveryFee, serviceFee, tax, total,
    partySize: party, perPerson, estimate, difference,
    withinEstimate: difference != null && difference <= 0.004,
  };
}

export const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
export const signedMoney = (n) => (n > 0.004 ? `+${money(n)}` : n < -0.004 ? `−${money(-n)}` : money(0));
