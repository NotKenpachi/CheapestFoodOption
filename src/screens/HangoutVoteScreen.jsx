import React, { useEffect } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { startVoteSimulation, tallyVotes, leader } from '../services/votingService.js';
import { money } from '../lib/pricing.js';
import { FoodTile, Icon, Rating, TopBar } from '../components/ui.jsx';
import { ME_ID, initials, participantsFor } from './HangoutSetupScreen.jsx';

export default function HangoutVoteScreen() {
  const { state, dispatch, go, back } = useApp();
  const { hangout, location } = state;
  const participants = participantsFor(hangout, location);
  const { options, votes, status } = hangout;
  const tally = tallyVotes(options, votes);
  const voted = participants.filter((p) => votes[p.id]);
  const waiting = participants.filter((p) => !votes[p.id]);
  const totalVotes = voted.length;
  const lead = totalVotes ? leader(options, votes) : null;
  const allIn = waiting.length === 0;

  // Friends vote "live" on their own.
  useEffect(() => {
    if (status !== 'voting') return undefined;
    const friends = participants.filter((p) => p.id !== ME_ID && !votes[p.id]);
    return startVoteSimulation({
      friends,
      options,
      onVote: (participantId, restaurantId) => dispatch({ type: 'CAST_VOTE', participantId, restaurantId }),
    });
    // Start once when voting opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function finalize() {
    const winner = leader(options, votes);
    dispatch({ type: 'FINALIZE_HANGOUT', winnerId: winner.id });
    go('hangoutWinner');
  }

  // Everyone has voted: close the vote automatically.
  useEffect(() => {
    if (status !== 'voting' || !allIn) return undefined;
    const t = setTimeout(finalize, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIn, status]);

  const friendCount = participants.length - 1;

  return (
    <div className="screen with-topbar">
      <TopBar eyebrow="Hangout" title={hangout.name} onBack={back} />
      <div className="stack pad">
        <div className="vote-status">
          <span className="live-dot" aria-hidden="true" />
          <span data-testid="vote-progress">
            {friendCount} {friendCount === 1 ? 'friend' : 'friends'} invited · {totalVotes}/{participants.length} voted
          </span>
        </div>

        <ul className="voter-row" aria-label="Who has voted">
          {participants.map((p) => (
            <li key={p.id} className={votes[p.id] ? 'voter done' : 'voter'}>
              <span className={`avatar sm av-${p.id}`}>{p.id === ME_ID ? 'You' : initials(p.name)}</span>
              <span className="voter-state">{votes[p.id] ? 'Voted' : 'Waiting'}</span>
            </li>
          ))}
        </ul>

        <p className="muted small">
          {allIn
            ? 'Everyone voted. Closing the vote…'
            : `Waiting on ${waiting.map((p) => (p.id === ME_ID ? 'you' : p.name.split(' ')[0])).join(', ')}.`}{' '}
          Tap a place to vote. You can change your vote until it closes.
        </p>

        <div className="options">
          {options.map((o) => {
            const n = tally[o.id];
            const pct = participants.length ? Math.round((n / participants.length) * 100) : 0;
            const mine = votes[ME_ID] === o.id;
            const isLead = lead && lead.id === o.id;
            const names = participants.filter((p) => votes[p.id] === o.id).map((p) => (p.id === ME_ID ? 'You' : p.name.split(' ')[0]));
            const fans = participants.filter((p) => p.prefs.includes(o.cuisine)).map((p) => (p.id === ME_ID ? 'you' : p.name.split(' ')[0]));
            return (
              <button
                key={o.id}
                type="button"
                className={`vote-card${mine ? ' mine' : ''}${isLead ? ' lead' : ''}`}
                aria-pressed={mine}
                onClick={() => dispatch({ type: 'CAST_VOTE', participantId: ME_ID, restaurantId: o.id })}
                data-testid="vote-option"
              >
                <span className="vote-top">
                  <FoodTile cuisine={o.cuisine} size={44} />
                  <span className="vote-info">
                    <span className="r-name">{o.name}</span>
                    <span className="r-meta">
                      {o.cuisine} <Rating value={o.rating} /> · {o.distanceMiles.toFixed(1)} mi from group
                    </span>
                    <span className="muted small">Fits {fans.join(', ') || 'the group'}</span>
                  </span>
                  <span className="vote-price">
                    <span className="price-mid">{money(o.estimatedCostPerPerson)}</span>
                    <span className="price-unit">/person</span>
                  </span>
                </span>
                <span className="bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </span>
                <span className="vote-foot">
                  <span className="muted small">{names.length ? names.join(', ') : 'No votes yet'}</span>
                  <span className="vote-count">
                    {isLead && <span className="lead-tag">Leading</span>}
                    {n} {n === 1 ? 'vote' : 'votes'}
                    {mine && <span className="sr-only"> (your vote)</span>}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="action-bar">
        <button type="button" className="btn primary big full" onClick={finalize} disabled={totalVotes === 0}>
          <Icon name="trophy" /> {totalVotes === 0 ? 'Waiting for votes' : `Finalize now${lead ? ` · ${lead.name} leads` : ''}`}
        </button>
      </div>
    </div>
  );
}
