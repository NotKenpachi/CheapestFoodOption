import React, { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { requestLocation, lookupArea } from '../services/locationService.js';
import { Icon } from '../components/ui.jsx';

export default function LocationScreen() {
  const { dispatch, go } = useApp();
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState(false);
  const [area, setArea] = useState('Downtown San José');

  async function finish(promise) {
    setBusy(true);
    const location = await promise;
    dispatch({ type: 'SET_LOCATION', location });
    go('cuisine');
  }

  return (
    <div className="screen location-screen">
      <div className="brand">
        <span className="brand-mark"><Icon name="bag" size={20} /></span>
        <span className="brand-name">Restaurant Hangout</span>
      </div>

      <div className="location-hero">
        <span className="pin-halo"><Icon name="pin" size={44} stroke={1.6} /></span>
        <h1>The cheapest good meal near you, in two taps.</h1>
        <p>We use your location to find nearby restaurants and sort them by what a meal will actually cost you per person.</p>
      </div>

      {manual ? (
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            finish(lookupArea(area));
          }}
        >
          <label htmlFor="area" className="label-strong">Neighborhood or address</label>
          <input id="area" className="input" value={area} onChange={(e) => setArea(e.target.value)} />
          <button type="submit" className="btn primary big" disabled={busy}>
            {busy ? 'Finding restaurants…' : 'Use this area'}
          </button>
          <button type="button" className="btn ghost" onClick={() => setManual(false)}>
            Use my location instead
          </button>
        </form>
      ) : (
        <div className="stack">
          <button type="button" className="btn primary big" onClick={() => finish(requestLocation())} disabled={busy}>
            {busy ? 'Locating you…' : 'Allow location access'}
          </button>
          <button type="button" className="btn secondary big" onClick={() => setManual(true)} disabled={busy}>
            Not now, enter an area
          </button>
          <p className="fineprint">Demo mode: location resolves to SJSU so results are the same every run.</p>
        </div>
      )}
    </div>
  );
}
