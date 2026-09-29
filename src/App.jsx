import React from 'react';
import { AppProvider, useApp } from './state/AppContext.jsx';
import LocationScreen from './screens/LocationScreen.jsx';
import CuisineScreen from './screens/CuisineScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import RestaurantScreen from './screens/RestaurantScreen.jsx';
import HangoutSetupScreen from './screens/HangoutSetupScreen.jsx';
import HangoutVoteScreen from './screens/HangoutVoteScreen.jsx';
import HangoutWinnerScreen from './screens/HangoutWinnerScreen.jsx';
import OrderScreen from './screens/OrderScreen.jsx';
import CheckoutScreen from './screens/CheckoutScreen.jsx';
import ConfirmationScreen from './screens/ConfirmationScreen.jsx';

const SCREENS = {
  location: LocationScreen,
  cuisine: CuisineScreen,
  results: ResultsScreen,
  restaurant: RestaurantScreen,
  hangoutSetup: HangoutSetupScreen,
  hangoutVote: HangoutVoteScreen,
  hangoutWinner: HangoutWinnerScreen,
  order: OrderScreen,
  checkout: CheckoutScreen,
  confirmation: ConfirmationScreen,
};

function Router() {
  const { state } = useApp();
  const Screen = SCREENS[state.screen];
  return (
    <main className="phone" key={state.screen}>
      <Screen />
    </main>
  );
}

export default function App({ initial }) {
  return (
    <div className="app-shell">
      <AppProvider initial={initial}>
        <Router />
      </AppProvider>
    </div>
  );
}
