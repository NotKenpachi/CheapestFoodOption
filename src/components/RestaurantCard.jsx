import React from 'react';
import { money } from '../lib/pricing.js';
import { FoodTile, Rating, FulfillmentTags, Travel } from './ui.jsx';

export default function RestaurantCard({ r, cheapest, onSelect }) {
  return (
    <button type="button" className={cheapest ? 'r-card cheapest' : 'r-card'} onClick={onSelect} data-testid="restaurant-card">
      {cheapest && <span className="ribbon">Cheapest nearby</span>}
      <span className="r-price">
        <span className="price-big" data-testid="card-price">{money(r.estimatedCostPerPerson)}</span>
        <span className="price-unit">/person</span>
        <span className="price-dist">· {r.distanceMiles.toFixed(1)} mi away</span>
      </span>
      <span className="r-body">
        <FoodTile cuisine={r.cuisine} size={52} />
        <span className="r-info">
          <span className="r-name">{r.name}</span>
          <span className="r-meta">
            {r.cuisine} <Rating value={r.rating} /> <Travel r={r} />
          </span>
          <FulfillmentTags options={r.fulfillmentOptions} />
        </span>
      </span>
    </button>
  );
}
