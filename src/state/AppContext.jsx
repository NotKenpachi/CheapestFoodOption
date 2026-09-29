import React, { createContext, useContext, useReducer } from 'react';
import { DEFAULT_FILTERS } from '../services/restaurantService.js';

const initialHangout = {
  name: 'Friday Dinner',
  invited: [],
  myPrefs: [],
  options: [],
  votes: {}, // participantId -> restaurantId
  status: 'setup', // setup | voting | done
  winnerId: null,
};

const initialOrder = {
  restaurantId: null,
  origin: 'search', // search | hangout
  estimate: null, // the "cheapest" promise carried from Search or the Hangout vote
  fulfillment: null,
  cart: {},
  partySize: 1,
  promoCode: '',
  details: { address: '', pickupTime: 'ASAP', tableNote: '' },
};

export const initialState = {
  screen: 'location',
  history: [],
  location: null,
  cuisine: null,
  filters: DEFAULT_FILTERS,
  selectedId: null,
  hangout: initialHangout,
  order: initialOrder,
  confirmation: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'GO':
      return { ...state, screen: action.screen, history: [...state.history, state.screen] };
    case 'BACK': {
      if (!state.history.length) return state;
      const history = state.history.slice(0, -1);
      return { ...state, screen: state.history[state.history.length - 1], history };
    }
    case 'SET_LOCATION':
      return { ...state, location: action.location };
    case 'SET_CUISINE':
      return { ...state, cuisine: action.cuisine };
    case 'SET_FILTERS':
      return { ...state, filters: action.filters };
    case 'SELECT_RESTAURANT':
      return { ...state, selectedId: action.id };
    case 'START_HANGOUT':
      return {
        ...state,
        hangout: { ...initialHangout, name: state.hangout.name, myPrefs: state.cuisine ? [state.cuisine] : [] },
      };
    case 'UPDATE_HANGOUT':
      return { ...state, hangout: { ...state.hangout, ...action.patch } };
    case 'CAST_VOTE':
      if (state.hangout.status !== 'voting') return state;
      return {
        ...state,
        hangout: { ...state.hangout, votes: { ...state.hangout.votes, [action.participantId]: action.restaurantId } },
      };
    case 'FINALIZE_HANGOUT':
      return { ...state, hangout: { ...state.hangout, status: 'done', winnerId: action.winnerId } };
    case 'START_ORDER':
      return {
        ...state,
        order: {
          ...initialOrder,
          restaurantId: action.restaurant.id,
          origin: action.origin,
          estimate: action.restaurant.estimatedCostPerPerson,
          fulfillment: action.restaurant.fulfillmentOptions[0],
          partySize: action.partySize,
        },
      };
    case 'UPDATE_ORDER':
      return { ...state, order: { ...state.order, ...action.patch } };
    case 'SET_QTY': {
      const cart = { ...state.order.cart };
      if (action.qty > 0) cart[action.itemId] = action.qty;
      else delete cart[action.itemId];
      return { ...state, order: { ...state.order, cart } };
    }
    case 'CONFIRM':
      return { ...state, confirmation: action.confirmation };
    case 'NEW_SEARCH':
      return {
        ...initialState,
        location: state.location,
        hangout: { ...initialHangout },
        screen: 'cuisine',
        history: [],
      };
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function AppProvider({ children, initial = initialState }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const go = (screen) => dispatch({ type: 'GO', screen });
  const back = () => dispatch({ type: 'BACK' });
  return <Ctx.Provider value={{ state, dispatch, go, back }}>{children}</Ctx.Provider>;
}

export function useApp() {
  return useContext(Ctx);
}
