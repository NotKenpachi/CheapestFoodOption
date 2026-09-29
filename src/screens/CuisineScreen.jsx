import React, { useMemo } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { CUISINES } from '../data/seed.js';
import { cuisineSummary } from '../services/restaurantService.js';
import { money } from '../lib/pricing.js';
import { FoodTile, Icon } from '../components/ui.jsx';

export default function CuisineScreen() {
  const { state, dispatch, go, back } = useApp();
  const summary = useMemo(() => cuisineSummary(state.location), [state.location]);

  return (
    <div className="screen">
      <div className="page-head">
        <button type="button" className="loc-pill" onClick={back} disabled={!state.history.length}>
          <Icon name="pin" size={15} /> {state.location.label}
        </button>
        <h1>What are you hungry for?</h1>
        <p className="muted">Pick a food and we'll rank nearby places from cheapest up.</p>
      </div>
      <div className="cuisine-grid">
        {CUISINES.map((c) => {
          const s = summary[c];
          return (
            <button
              key={c}
              type="button"
              className="cuisine-btn"
              onClick={() => {
                dispatch({ type: 'SET_CUISINE', cuisine: c });
                go('results');
              }}
            >
              <FoodTile cuisine={c} size={48} />
              <span className="cuisine-name">{c}</span>
              <span className="cuisine-from">{s ? `from ${money(s.from)} · ${s.count} nearby` : 'None nearby'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
