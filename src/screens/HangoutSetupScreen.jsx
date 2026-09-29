import React, { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { CUISINES, HOME } from '../data/seed.js';
import { getFriends, getRestaurant, suggestForGroup } from '../services/restaurantService.js';
import { distanceMiles } from '../lib/geo.js';
import { Chip, Icon, TopBar } from '../components/ui.jsx';

export const ME_ID = 'you';

export function participantsFor(hangout, location) {
  const friends = getFriends().filter((f) => hangout.invited.includes(f.id));
  const me = { id: ME_ID, name: 'You', prefs: hangout.myPrefs, location: location || HOME };
  return [me, ...friends];
}

export const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2);

function inviteCode(name) {
  let h = 7;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 46656;
  return `RH-${h.toString(36).toUpperCase().padStart(3, '0')}`;
}

export default function HangoutSetupScreen() {
  const { state, dispatch, go, back } = useApp();
  const { hangout, location } = state;
  const [copyState, setCopyState] = useState('');
  const [busy, setBusy] = useState(false);
  const friends = getFriends();
  const origin = getRestaurant(state.selectedId);
  const link = `https://restauranthangout.app/join/${inviteCode(hangout.name)}`;
  const patch = (p) => dispatch({ type: 'UPDATE_HANGOUT', patch: p });

  const count = hangout.invited.length;
  const ready = count > 0 && hangout.myPrefs.length > 0;
  const distances = useMemo(
    () => Object.fromEntries(friends.map((f) => [f.id, distanceMiles(location, f.location)])),
    [friends, location]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopyState('Link copied');
    } catch {
      document.getElementById('invite-link')?.select();
      setCopyState('Press Ctrl/Cmd + C to copy');
    }
  }

  async function findSpots() {
    setBusy(true);
    const participants = participantsFor(hangout, location);
    const options = await suggestForGroup({ participants, pinnedId: state.selectedId });
    patch({ options, votes: {}, status: 'voting', winnerId: null });
    go('hangoutVote');
  }

  return (
    <div className="screen with-topbar">
      <TopBar eyebrow="Start a Hangout" title={`From ${origin.name}`} onBack={back} />
      <div className="stack pad">
        <div className="field">
          <label htmlFor="hangout-name" className="label">Hangout name</label>
          <input id="hangout-name" className="input" value={hangout.name} onChange={(e) => patch({ name: e.target.value })} />
        </div>

        <div className="field">
          <label htmlFor="invite-link" className="label">Share invite link</label>
          <div className="copy-row">
            <input id="invite-link" className="input mono" readOnly value={link} onFocus={(e) => e.target.select()} />
            <button type="button" className="btn secondary" onClick={copy}>
              <Icon name="copy" size={18} /> Copy
            </button>
          </div>
          <span className="muted small" aria-live="polite">{copyState || 'Or invite friends who are nearby right now:'}</span>
        </div>

        <fieldset className="field">
          <legend className="label">Friends nearby</legend>
          <div className="friend-list">
            {friends.map((f) => {
              const on = hangout.invited.includes(f.id);
              return (
                <div key={f.id} className="friend-row">
                  <span className={`avatar av-${f.id}`}>{initials(f.name)}</span>
                  <span className="friend-info">
                    <span className="friend-name">{f.name}</span>
                    <span className="muted small">
                      {distances[f.id].toFixed(1)} mi · picked {f.prefs.join(', ')}
                    </span>
                  </span>
                  <button
                    type="button"
                    className={on ? 'btn toggle on' : 'btn toggle'}
                    aria-pressed={on}
                    aria-label={`${on ? 'Remove' : 'Invite'} ${f.name}`}
                    onClick={() =>
                      patch({ invited: on ? hangout.invited.filter((x) => x !== f.id) : [...hangout.invited, f.id] })
                    }
                  >
                    {on ? <><Icon name="check" size={16} /> Invited</> : 'Invite'}
                  </button>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="label">Your cuisine picks</legend>
          <div className="chip-row wrap">
            {CUISINES.map((c) => {
              const on = hangout.myPrefs.includes(c);
              return (
                <Chip
                  key={c}
                  on={on}
                  onClick={() => patch({ myPrefs: on ? hangout.myPrefs.filter((x) => x !== c) : [...hangout.myPrefs, c] })}
                >
                  {c}
                </Chip>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="action-bar">
        <button type="button" className="btn primary big full" disabled={!ready || busy} onClick={findSpots}>
          {busy
            ? 'Finding cheap spots…'
            : count === 0
              ? 'Invite at least one friend'
              : hangout.myPrefs.length === 0
                ? 'Pick at least one cuisine'
                : `Find cheap spots for ${count + 1} people`}
        </button>
      </div>
    </div>
  );
}
