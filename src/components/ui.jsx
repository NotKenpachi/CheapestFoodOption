import React from 'react';
import { FULFILLMENT_LABELS } from '../data/seed.js';
import { money, signedMoney } from '../lib/pricing.js';

/* ---------- icons ---------- */

const ICONS = {
  back: <path d="M15 5l-7 7 7 7" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.6c2.6.2 4.4 2 5.3 5" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.5" r="1.8" />
      <path d="M10 21l2-6-2.5-2.5 1-4.5 3.5 3 3 1M9.5 8.5L7 10v3M14 15l2 6" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V11l2-5h10l2 5v5" />
      <path d="M3 16h18v2H3z" />
      <circle cx="7.5" cy="13" r="0.8" />
      <circle cx="16.5" cy="13" r="0.8" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  bag: (
    <>
      <path d="M5 8h14l-1.3 12H6.3z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
};

export function Icon({ name, size = 20, stroke = 1.9, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const FOOD = {
  Pizza: (
    <>
      <path d="M12 3l8.5 15.5Q12 21.5 3.5 18.5z" />
      <circle cx="11" cy="12" r="1.2" />
      <circle cx="13.5" cy="16" r="1.2" />
      <circle cx="10" cy="17" r="0.9" />
    </>
  ),
  Burgers: (
    <>
      <path d="M4 11a8 6 0 0 1 16 0z" />
      <path d="M3 14h18" />
      <path d="M4 17h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </>
  ),
  Mexican: (
    <>
      <path d="M3 18a9 9 0 0 1 18 0z" />
      <path d="M8 14l1-1M12 12v1.5M16 14l-1-1" />
    </>
  ),
  Chinese: (
    <>
      <path d="M3 12h18a9 9 0 0 1-18 0z" />
      <path d="M13 3l-2.5 9M18 4l-4.5 8" />
    </>
  ),
  Indian: (
    <>
      <path d="M4 11h16l-2 8H6z" />
      <path d="M9 3.5c-1 1.8 1 2.8 0 5M13 3.5c-1 1.8 1 2.8 0 5" />
    </>
  ),
  Sushi: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  Thai: (
    <>
      <path d="M3 12h18a9 9 0 0 1-18 0z" />
      <path d="M7 9c1.5-2 3 0 4.5-2s3 0 4.5-2" />
    </>
  ),
  Coffee: (
    <>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M17 10h1.5a2 2 0 0 1 0 4H17" />
      <path d="M8 3.5v2M12 3.5v2" />
    </>
  ),
};

export function FoodTile({ cuisine, size = 56 }) {
  return (
    <span className={`food-tile food-${cuisine.toLowerCase()}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {FOOD[cuisine]}
      </svg>
    </span>
  );
}

/* ---------- small pieces ---------- */

export function TopBar({ title, eyebrow, onBack, right }) {
  return (
    <header className="topbar">
      {onBack ? (
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
      ) : (
        <span className="icon-btn-spacer" />
      )}
      <div className="topbar-title">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <span>{title}</span>
      </div>
      {right || <span className="icon-btn-spacer" />}
    </header>
  );
}

export function Rating({ value }) {
  return (
    <span className="rating" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
      </svg>
      {value.toFixed(1)}
    </span>
  );
}

export function FulfillmentTags({ options }) {
  return (
    <span className="ff-tags">
      {['delivery', 'carryout', 'dinein'].map((k) => (
        <span key={k} className={options.includes(k) ? 'ff on' : 'ff off'}>
          {options.includes(k) ? '' : <span className="sr-only">No </span>}
          {FULFILLMENT_LABELS[k]}
        </span>
      ))}
    </span>
  );
}

export function Travel({ r }) {
  return (
    <span className="travel">
      <Icon name={r.travel.mode === 'walk' ? 'walk' : 'car'} size={14} />
      {r.distanceMiles.toFixed(1)} mi · {r.travel.minutes} min {r.travel.mode}
    </span>
  );
}

export function Stepper({ value, onChange, label, min = 0, max = 20 }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Remove one ${label}`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" className="plus" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Add one ${label}`}>
        +
      </button>
    </div>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          disabled={o.disabled}
          className={o.value === value ? 'seg on' : 'seg'}
          onClick={() => onChange(o.value)}
        >
          <span className="seg-label">{o.label}</span>
          {o.sub && <span className="seg-sub">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}

export function Chip({ on, onClick, children, ...rest }) {
  return (
    <button type="button" className={on ? 'chip on' : 'chip'} aria-pressed={!!on} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

/** The "cheapest promise" check: original estimate vs what the cart costs per person now. */
export function CostCompare({ pricing, originLabel, compact }) {
  const empty = pricing.itemCount === 0;
  const state = empty ? 'idle' : pricing.withinEstimate ? 'good' : 'over';
  return (
    <section className={`compare compare-${state}${compact ? ' compact' : ''}`} aria-label="Cost compared with cheapest estimate">
      <div className="compare-row">
        <div className="compare-cell">
          <span className="label">Cheapest estimate</span>
          <span className="num">{money(pricing.estimate)}<small>/person</small></span>
        </div>
        <div className="compare-cell">
          <span className="label">Current total</span>
          <span className="num" data-testid="per-person">{money(pricing.perPerson)}<small>/person</small></span>
        </div>
        <div className="compare-cell diff">
          <span className="label">Difference</span>
          <span className="num" data-testid="difference">{empty ? '—' : signedMoney(pricing.difference)}</span>
        </div>
      </div>
      {!compact && (
        <p className="compare-note">
          {empty
            ? `Add items to compare against the estimate ${originLabel}.`
            : pricing.withinEstimate
              ? `You're at or under the estimate ${originLabel}.`
              : `You're ${money(pricing.difference)} per person over the estimate ${originLabel}. Fees, extra items and tax all count.`}
        </p>
      )}
    </section>
  );
}
