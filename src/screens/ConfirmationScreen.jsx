import React from 'react';
import { useApp } from '../state/AppContext.jsx';
import { money, signedMoney } from '../lib/pricing.js';
import { FULFILLMENT_LABELS } from '../data/seed.js';
import { Icon } from '../components/ui.jsx';

function statusText(c) {
  if (c.fulfillment === 'delivery')
    return ['On its way in 25–35 min', `Delivering to ${c.details.address || '1 Washington Sq, San José'}.`];
  if (c.fulfillment === 'carryout')
    return [`Pickup ${c.details.pickupTime === 'ASAP' ? 'in about 15 min' : c.details.pickupTime.toLowerCase()}`, `Give order ${c.number} at the counter, ${c.restaurant.address}.`];
  return [`Table for ${c.pricing.partySize} is set`, `Show this screen at ${c.restaurant.name}. Food starts when you're seated.`];
}

export default function ConfirmationScreen() {
  const { state, dispatch } = useApp();
  const c = state.confirmation;
  const [title, sub] = statusText(c);
  const p = c.pricing;

  return (
    <div className="screen">
      <div className="stack pad confirm">
        <span className="check-halo"><Icon name="check" size={36} stroke={2.2} /></span>
        <span className="eyebrow good">Order {c.number} confirmed</span>
        <h1>{title}</h1>
        <p className="muted">{sub}</p>

        <section className="receipt">
          <div className="receipt-row"><span>Restaurant</span><span>{c.restaurant.name}</span></div>
          {c.hangoutName && <div className="receipt-row"><span>Hangout</span><span>{c.hangoutName}</span></div>}
          <div className="receipt-row"><span>Method</span><span>{FULFILLMENT_LABELS[c.fulfillment]}</span></div>
          <div className="receipt-row"><span>Items</span><span>{p.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</span></div>
          <div className="receipt-row total"><span>Total paid</span><span className="mono">{money(p.total)}</span></div>
        </section>

        <section className={`final-compare ${p.withinEstimate ? 'good' : 'over'}`} aria-label="Final cost versus estimate">
          <span className="label">Cheapest promise check</span>
          <div className="receipt-row"><span>Estimate {c.originLabel}</span><span className="mono">{money(p.estimate)}/person</span></div>
          <div className="receipt-row"><span>You paid</span><span className="mono">{money(p.perPerson)}/person</span></div>
          <div className="receipt-row total"><span>Difference</span><span className="mono" data-testid="final-difference">{signedMoney(p.difference)}</span></div>
        </section>
      </div>
      <div className="action-bar">
        <button type="button" className="btn primary big full" onClick={() => dispatch({ type: 'NEW_SEARCH' })}>
          Start a new search
        </button>
      </div>
    </div>
  );
}
