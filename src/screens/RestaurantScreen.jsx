import React from 'react';
import { useApp } from '../state/AppContext.jsx';
import { getRestaurant } from '../services/restaurantService.js';
import { money } from '../lib/pricing.js';
import { FoodTile, FulfillmentTags, Icon, Rating, TopBar, Travel } from '../components/ui.jsx';

export default function RestaurantScreen() {
  const { state, dispatch, go, back } = useApp();
  const r = getRestaurant(state.selectedId, state.location);
  const mains = r.menuItems.filter((m) => m.category === 'Mains');

  return (
    <div className="screen with-topbar">
      <TopBar title={r.name} eyebrow={r.cuisine} onBack={back} />
      <div className="detail">
        <div className="detail-hero">
          <FoodTile cuisine={r.cuisine} size={76} />
          <div className="stack-tight">
            <h1 className="detail-name">{r.name}</h1>
            <span className="r-meta">
              <Rating value={r.rating} /> <Travel r={r} />
            </span>
            <span className="muted small">{r.address}</span>
          </div>
        </div>

        <section className="estimate-card" aria-label="Cheapest estimate">
          <span className="label">Cheapest estimate</span>
          <span className="estimate-num">{money(r.estimatedCostPerPerson)}<small>/person</small></span>
          <span className="muted small">{r.estimateBasis} plus tax. We'll hold your order to this number and show you any difference at checkout.</span>
        </section>

        <div className="stack-tight">
          <span className="label">Ways to get it</span>
          <FulfillmentTags options={r.fulfillmentOptions} />
          {r.fees.delivery != null && (
            <span className="muted small">Delivery adds a {money(r.fees.delivery)} fee and a {Math.round(r.fees.deliveryServiceRate * 100)}% service fee.</span>
          )}
        </div>

        <div className="stack-tight">
          <span className="label">Popular mains</span>
          <ul className="mini-menu">
            {mains.map((m) => (
              <li key={m.id}>
                <span>{m.name}</span>
                <span className="mono">{money(m.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="action-bar">
        <button
          type="button"
          className="btn secondary big"
          onClick={() => {
            dispatch({ type: 'START_HANGOUT' });
            go('hangoutSetup');
          }}
        >
          <Icon name="users" /> Start a Hangout
        </button>
        <button
          type="button"
          className="btn primary big"
          onClick={() => {
            dispatch({ type: 'START_ORDER', restaurant: r, origin: 'search', partySize: 1 });
            go('order');
          }}
        >
          Order from here
        </button>
      </div>
    </div>
  );
}
