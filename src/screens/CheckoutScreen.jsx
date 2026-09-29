import React, { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { money, PROMO_CODES } from '../lib/pricing.js';
import { FULFILLMENT_LABELS } from '../data/seed.js';
import { CostCompare, Segmented, Stepper, TopBar } from '../components/ui.jsx';
import { useOrderPricing, fulfillmentOptions } from './OrderScreen.jsx';

export default function CheckoutScreen() {
  const { state, dispatch, go, back } = useApp();
  const { order } = state;
  const { restaurant, pricing, originLabel } = useOrderPricing();
  const [code, setCode] = useState(order.promoCode);
  const [codeMsg, setCodeMsg] = useState('');
  const setDetails = (p) => dispatch({ type: 'UPDATE_ORDER', patch: { details: { ...order.details, ...p } } });

  function applyCode() {
    const ok = PROMO_CODES[code.trim().toUpperCase()];
    dispatch({ type: 'UPDATE_ORDER', patch: { promoCode: ok ? code.trim().toUpperCase() : '' } });
    setCodeMsg(ok ? `${ok.label} applied` : code.trim() ? 'That code isn’t valid. Try SJSU10.' : '');
  }

  function confirm() {
    const number = `RH-${1000 + ((restaurant.id.length * 97 + pricing.itemCount * 13 + Math.round(pricing.total * 100)) % 9000)}`;
    dispatch({
      type: 'CONFIRM',
      confirmation: {
        number,
        restaurant: { name: restaurant.name, address: restaurant.address },
        fulfillment: order.fulfillment,
        details: order.details,
        pricing,
        originLabel,
        hangoutName: order.origin === 'hangout' ? state.hangout.name : null,
      },
    });
    go('confirmation');
  }

  const rows = [
    ['Subtotal', money(pricing.subtotal)],
    pricing.discount && [pricing.discount.label, `−${money(pricing.discountAmount)}`],
    order.fulfillment === 'delivery' && ['Delivery fee', money(pricing.deliveryFee)],
    order.fulfillment === 'delivery' && [`Service fee (${Math.round(restaurant.fees.deliveryServiceRate * 100)}%)`, money(pricing.serviceFee)],
    ['Tax (9.375%)', money(pricing.tax)],
  ].filter(Boolean);

  return (
    <div className="screen with-topbar">
      <TopBar eyebrow="Checkout" title={restaurant.name} onBack={back} />
      <div className="stack pad">
        <CostCompare pricing={pricing} originLabel={originLabel} />

        <Segmented
          label="Fulfillment method"
          options={fulfillmentOptions(restaurant)}
          value={order.fulfillment}
          onChange={(v) => dispatch({ type: 'UPDATE_ORDER', patch: { fulfillment: v } })}
        />

        {order.fulfillment === 'delivery' && (
          <div className="field">
            <label htmlFor="address" className="label">Deliver to</label>
            <input id="address" className="input" placeholder="1 Washington Sq, San José" value={order.details.address} onChange={(e) => setDetails({ address: e.target.value })} />
          </div>
        )}
        {order.fulfillment === 'carryout' && (
          <div className="field">
            <label htmlFor="pickup" className="label">Pickup time</label>
            <select id="pickup" className="input" value={order.details.pickupTime} onChange={(e) => setDetails({ pickupTime: e.target.value })}>
              {['ASAP', 'In 30 min', 'In 45 min', 'In 1 hour'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}
        {order.fulfillment === 'dinein' && (
          <div className="field">
            <label htmlFor="table-note" className="label">Note for the host</label>
            <input id="table-note" className="input" placeholder="Booth if possible" value={order.details.tableNote} onChange={(e) => setDetails({ tableNote: e.target.value })} />
          </div>
        )}

        <section className="card-plain">
          <span className="label">Your items</span>
          {pricing.lines.map((l) => (
            <div key={l.id} className="menu-row">
              <div className="stack-tight">
                <span className="menu-name">{l.name}</span>
                <span className="mono muted">{money(l.lineTotal)}</span>
              </div>
              <Stepper label={l.name} value={l.qty} onChange={(qty) => dispatch({ type: 'SET_QTY', itemId: l.id, qty })} />
            </div>
          ))}
          {pricing.itemCount === 0 && (
            <button type="button" className="btn secondary" onClick={back}>Back to menu</button>
          )}
        </section>

        <div className="field">
          <label htmlFor="promo" className="label">Promo code</label>
          <div className="copy-row">
            <input id="promo" className="input mono" placeholder="SJSU10" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="button" className="btn secondary" onClick={applyCode}>Apply</button>
          </div>
          {codeMsg && <span className="muted small" aria-live="polite">{codeMsg}</span>}
        </div>

        <section className="receipt" aria-label="Price breakdown">
          {rows.map(([k, v]) => (
            <div key={k} className="receipt-row">
              <span>{k}</span>
              <span className="mono">{v}</span>
            </div>
          ))}
          <div className="receipt-row total">
            <span>Total</span>
            <span className="mono" data-testid="checkout-total">{money(pricing.total)}</span>
          </div>
          <div className="receipt-row">
            <span>Per person ({pricing.partySize})</span>
            <span className="mono">{money(pricing.perPerson)}</span>
          </div>
        </section>
      </div>

      <div className="action-bar">
        <button type="button" className="btn primary big full split" onClick={confirm} disabled={pricing.itemCount === 0}>
          <span>Confirm {FULFILLMENT_LABELS[order.fulfillment].toLowerCase()}</span>
          <span className="mono">{money(pricing.total)}</span>
        </button>
      </div>
    </div>
  );
}
