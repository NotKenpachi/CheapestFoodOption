import React, { useState } from 'react';
import { DEFAULT_FILTERS } from '../services/restaurantService.js';
import { Chip, Icon } from './ui.jsx';

export function activeFilterCount(f) {
  return ['maxPrice', 'maxDistance', 'minRating', 'fulfillment'].filter((k) => f[k] !== DEFAULT_FILTERS[k]).length;
}

export default function FilterSheet({ filters, onApply, onClose }) {
  const [f, setF] = useState(filters);
  const set = (patch) => setF((x) => ({ ...x, ...patch }));
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="filter-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2 id="filter-title">Filters</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close filters">
            <Icon name="close" />
          </button>
        </div>

        <div className="field">
          <label htmlFor="max-price">
            Max cost per person <strong>${f.maxPrice}</strong>
          </label>
          <input id="max-price" type="range" min="4" max="20" step="1" value={f.maxPrice} onChange={(e) => set({ maxPrice: Number(e.target.value) })} />
        </div>

        <fieldset className="field">
          <legend>Distance</legend>
          <div className="chip-row">
            {[0.5, 1, 2, 3].map((d) => (
              <Chip key={d} on={f.maxDistance === d} onClick={() => set({ maxDistance: d })}>
                Within {d} mi
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Rating</legend>
          <div className="chip-row">
            {[
              [0, 'Any'],
              [4, '4.0+'],
              [4.5, '4.5+'],
            ].map(([v, l]) => (
              <Chip key={v} on={f.minRating === v} onClick={() => set({ minRating: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Fulfillment</legend>
          <div className="chip-row">
            {[
              ['any', 'Any'],
              ['delivery', 'Delivery'],
              ['carryout', 'Carry-out'],
              ['dinein', 'Dine-in'],
            ].map(([v, l]) => (
              <Chip key={v} on={f.fulfillment === v} onClick={() => set({ fulfillment: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="sheet-actions">
          <button type="button" className="btn secondary" onClick={() => setF(DEFAULT_FILTERS)}>
            Reset
          </button>
          <button type="button" className="btn primary" onClick={() => onApply(f)}>
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
