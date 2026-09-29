import React, { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { CUISINES } from '../data/seed.js';
import { searchRestaurants, DEFAULT_FILTERS } from '../services/restaurantService.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import FilterSheet, { activeFilterCount } from '../components/FilterSheet.jsx';
import { Chip, Icon, TopBar } from '../components/ui.jsx';

export default function ResultsScreen() {
  const { state, dispatch, go, back } = useApp();
  const { cuisine, location, filters } = state;
  const [results, setResults] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let live = true;
    setResults(null);
    searchRestaurants({ cuisine, location, filters }).then((r) => live && setResults(r));
    return () => {
      live = false;
    };
  }, [cuisine, location, filters]);

  const nActive = activeFilterCount(filters);

  return (
    <div className="screen with-topbar">
      <TopBar
        eyebrow={location.label}
        title={`${cuisine} near you`}
        onBack={back}
        right={
          <button type="button" className="icon-btn badge-host" onClick={() => setShowFilters(true)} aria-label={`Filters${nActive ? `, ${nActive} active` : ''}`}>
            <Icon name="filter" />
            {nActive > 0 && <span className="badge">{nActive}</span>}
          </button>
        }
      />
      <div className="chip-row scroll-x" role="group" aria-label="Cuisine">
        {CUISINES.map((c) => (
          <Chip key={c} on={c === cuisine} onClick={() => dispatch({ type: 'SET_CUISINE', cuisine: c })}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="results-meta">
        <span>{results ? `${results.length} ${results.length === 1 ? 'place' : 'places'}` : 'Searching…'}</span>
        <span className="sort-label">Sorted by cost per person, low to high</span>
      </div>

      <div className="list" aria-busy={!results}>
        {!results && [0, 1, 2].map((i) => <div key={i} className="skeleton" />)}
        {results &&
          results.map((r, i) => (
            <RestaurantCard
              key={r.id}
              r={r}
              cheapest={i === 0}
              onSelect={() => {
                dispatch({ type: 'SELECT_RESTAURANT', id: r.id });
                go('restaurant');
              }}
            />
          ))}
        {results && results.length === 0 && (
          <div className="empty">
            <h2>No {cuisine.toLowerCase()} spots match these filters</h2>
            <p className="muted">Loosen the price or distance limit to see more.</p>
            <button type="button" className="btn secondary" onClick={() => dispatch({ type: 'SET_FILTERS', filters: DEFAULT_FILTERS })}>
              Clear filters
            </button>
          </div>
        )}
        {results && results.length > 0 && (
          <p className="fineprint">Estimate = the cheapest main on the menu plus tax, for one person.</p>
        )}
      </div>

      {showFilters && (
        <FilterSheet
          filters={filters}
          onClose={() => setShowFilters(false)}
          onApply={(f) => {
            dispatch({ type: 'SET_FILTERS', filters: f });
            setShowFilters(false);
          }}
        />
      )}
    </div>
  );
}
