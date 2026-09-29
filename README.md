# Restaurant Hangout — working demo

Mobile-first demo of a food app with one promise: **find the cheapest nearby option for the food you want, coordinate a group meetup, then order while always seeing the real total.**

Everything runs in the browser with deterministic mock data. No API keys, no backend.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev        # open the URL Vite prints (usually http://localhost:5173)
```

Other commands:

```bash
npm test               # unit tests + a full end-to-end journey test
npm run build          # production build in dist/
npm run preview        # serve the production build
npm run build:single   # one self-contained dist-single/index.html you can share
```

Tip: in Chrome DevTools, toggle the device toolbar (Ctrl/Cmd+Shift+M) and pick a phone to demo at phone size. On a desktop it renders as a centered phone.

## Demo script (≈3 minutes)

1. **Allow location access** → the app resolves to SJSU (fixed for the demo).
2. **Pick Pizza** → results are sorted cheapest first; the top card is marked *Cheapest nearby* with cost/person, distance, travel time, rating and fulfillment options. Open **Filters** to show price / distance / rating / fulfillment filtering.
3. Tap **Tony's Pizza** → the restaurant page shows the *cheapest estimate* ($/person = cheapest main + tax).
4. **Start a Hangout** → invite Alex, Sam and Jordan (or copy the invite link). Each friend's cuisine picks are shown; set yours.
5. **Find cheap spots** → 2–3 suggestions that fit the group and are cheap. Tap one to vote. Friends vote live over ~7 seconds; the UI shows who voted, totals, who's remaining and the leader. It auto-closes when everyone has voted, or tap **Finalize now**.
6. **Order for the group** → choose Delivery / Carry-out / Dine-in, add items, adjust party size. The running total and the **estimate vs current vs difference** panel update on every change.
7. **Review order** → full breakdown (subtotal, discount, delivery + service fees, tax, total, per person). Try promo code `SJSU10`. Groups of 3+ from a Hangout get a 5% group deal automatically; the better discount applies.
8. **Confirm** → confirmation with the final *cheapest promise check*.

## How it's built

```
src/
  data/seed.js                 seeded restaurants (24), menus, friends, tax/fee constants
  services/                    mock "API" layer — replace these with real calls later
    locationService.js         requestLocation(), lookupArea()
    restaurantService.js       searchRestaurants(), suggestForGroup(), getRestaurant()
    votingService.js           startVoteSimulation() (stand-in for a realtime channel)
    config.js                  simulated latency and vote timing
  lib/pricing.js               priceCart(): the single source of truth for totals
  lib/geo.js                   distance + travel-time helpers
  state/AppContext.jsx         app state (useReducer) — carries the selected restaurant,
                               the original estimate, the hangout and the cart across screens
  components/                  RestaurantCard, FilterSheet, CostCompare, Stepper, ...
  screens/                     one file per screen in the journey
  test/                        logic tests + an end-to-end flow test (Vitest + Testing Library)
```

Key rules:

- **Estimate** = cheapest main on the menu × (1 + 9.375% tax), per person. It's captured when you pick a restaurant (from Search, or the Hangout winner) and carried into ordering.
- **Per-person cost** = cart total ÷ party size. Difference = per-person − estimate.
- Delivery adds the restaurant's delivery fee plus a 12% service fee; carry-out and dine-in have no fees.
- Data is deterministic, so the same taps give the same results every run.

To connect real services, keep the function signatures in `src/services/` and swap the bodies (e.g. `navigator.geolocation` in `requestLocation`, a places/menu API in `searchRestaurants`, a websocket in `startVoteSimulation`).
