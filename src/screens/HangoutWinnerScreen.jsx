import React from 'react';
import { useApp } from '../state/AppContext.jsx';
import { tallyVotes } from '../services/votingService.js';
import { money } from '../lib/pricing.js';
import { FoodTile, FulfillmentTags, Icon, Rating, TopBar } from '../components/ui.jsx';
import { participantsFor } from './HangoutSetupScreen.jsx';

export default function HangoutWinnerScreen() {
  const { state, dispatch, go } = useApp();
  const { hangout, location } = state;
  const participants = participantsFor(hangout, location);
  const winner = hangout.options.find((o) => o.id === hangout.winnerId);
  const tally = tallyVotes(hangout.options, hangout.votes);
  const sorted = [...hangout.options].sort((a, b) => tally[b.id] - tally[a.id]);

  return (
    <div className="screen with-topbar">
      <TopBar eyebrow="Hangout" title={hangout.name} />
      <div className="stack pad">
        <div className="winner-hero">
          <span className="trophy"><Icon name="trophy" size={34} stroke={1.7} /></span>
          <span className="eyebrow good">The group picked</span>
          <h1 data-testid="winner-name">{winner.name}</h1>
          <p className="muted">
            {participants.length} people · {money(winner.estimatedCostPerPerson)} per person estimate · {winner.distanceMiles.toFixed(1)} mi from the group
          </p>
        </div>

        <section className="winner-card">
          <FoodTile cuisine={winner.cuisine} size={56} />
          <div className="stack-tight">
            <span className="r-meta">{winner.cuisine} <Rating value={winner.rating} /></span>
            <FulfillmentTags options={winner.fulfillmentOptions} />
            <span className="muted small">{winner.address}</span>
          </div>
        </section>

        <section className="tally">
          <span className="label">Final tally</span>
          {sorted.map((o) => (
            <div key={o.id} className={o.id === winner.id ? 'tally-row win' : 'tally-row'}>
              <span>{o.name}</span>
              <span className="mono">
                {money(o.estimatedCostPerPerson)} · {tally[o.id]} {tally[o.id] === 1 ? 'vote' : 'votes'}
              </span>
            </div>
          ))}
        </section>
      </div>

      <div className="action-bar">
        <button
          type="button"
          className="btn primary big full"
          onClick={() => {
            dispatch({ type: 'START_ORDER', restaurant: winner, origin: 'hangout', partySize: participants.length });
            go('order');
          }}
        >
          Order for the group ({participants.length})
        </button>
      </div>
    </div>
  );
}
