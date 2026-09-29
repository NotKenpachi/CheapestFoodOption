import React from 'react';
import { useApp } from '../state/AppContext.jsx';
import { getRestaurant } from '../services/restaurantService.js';
import { priceCart, money } from '../lib/pricing.js';
import { FULFILLMENT_LABELS } from '../data/seed.js';
import { CostCompare, Segmented, Stepper, TopBar } from '../components/ui.jsx';

export function useOrderPricing() {
  const { state } = useApp();
  const { order, location } = state;
  const restaurant = getRestaurant(order.restaurantId, location);
  const pricing = priceCart({
    restaurant,
    cart: order.cart,
    fulfillment: order.fulfillment,
    partySize: order.partySize,
    promoCode: order.promoCode,
    fromHangout: order.origin === 'hangout',
    estimate: order.estimate,
  });
  const originLabel = order.origin === 'hangout' ? `from your Hangout vote` : `from your search`;
  return { restaurant, pricing, originLabel };
}

export function fulfillmentOptions(restaurant) {
  return ['delivery', 'carryout', 'dinein'].map((k) => ({
    value: k,
    label: FULFILLMENT_LABELS[k],
    disabled: !restaurant.fulfillmentOptions.includes(k),
    sub: !restaurant.fulfillmentOptions.includes(k)
      ? 'Not offered'
      : k === 'delivery'
        ? `${money(restaurant.fees.delivery)} + ${Math.round(restaurant.fees.deliveryServiceRate * 100)}% fee`
        : 'No fees',
  }));
}

export default function OrderScreen() {
  const { state, dispatch, go, back } = useApp();
  const { order } = state;
  const { restaurant, pricing, originLabel } = useOrderPricing();
  const categories = ['Mains', 'Sides', 'Drinks'];

  return (
    <div className="screen with-topbar">
      <TopBar eyebrow={order.origin === 'hangout' ? `Hangout · ${state.hangout.name}` : 'Order'} title={restaurant.name} onBack={back} />
      <div className="stack pad">
        <div className="field">
          <span className="label" id="ff-label">How do you want it?</span>
          <Segmented
            label="Fulfillment method"
            options={fulfillmentOptions(restaurant)}
            value={order.fulfillment}
            onChange={(v) => dispatch({ type: 'UPDATE_ORDER', patch: { fulfillment: v } })}
          />
        </div>

        <div className="party-row">
          <div className="stack-tight">
            <span className="label">Splitting between</span>
            <span className="muted small">Per-person cost divides the total by this.</span>
          </div>
          <Stepper
            label="person"
            min={1}
            max={12}
            value={order.partySize}
            onChange={(n) => dispatch({ type: 'UPDATE_ORDER', patch: { partySize: n } })}
          />
        </div>

        {categories.map((cat) => (
          <section key={cat} className="menu-section" aria-label={cat}>
            <h2 className="section-title">{cat}</h2>
            {restaurant.menuItems
              .filter((m) => m.category === cat)
              .map((m) => (
                <div key={m.id} className="menu-row">
                  <div className="stack-tight">
                    <span className="menu-name">{m.name}</span>
                    <span className="mono muted">{money(m.price)}</span>
                  </div>
                  <Stepper
                    label={m.name}
                    value={order.cart[m.id] || 0}
                    onChange={(qty) => dispatch({ type: 'SET_QTY', itemId: m.id, qty })}
                  />
                </div>
              ))}
          </section>
        ))}
      </div>

      <div className="action-bar column">
        <CostCompare pricing={pricing} originLabel={originLabel} compact />
        <button type="button" className="btn primary big full split" disabled={pricing.itemCount === 0} onClick={() => go('checkout')}>
          <span>{pricing.itemCount === 0 ? 'Add an item to continue' : `Review order · ${pricing.itemCount} ${pricing.itemCount === 1 ? 'item' : 'items'}`}</span>
          <span className="mono" data-testid="running-total">{money(pricing.total)}</span>
        </button>
      </div>
    </div>
  );
}
