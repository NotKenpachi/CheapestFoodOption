import { HOME } from '../data/seed.js';
import { wait } from './config.js';

/**
 * Mock location service. The demo always resolves to the same spot near
 * SJSU so distances and prices are identical on every run.
 *
 * To use the real device location later, replace the body of
 * requestLocation with navigator.geolocation.getCurrentPosition(...).
 */
export async function requestLocation() {
  await wait();
  return { lat: HOME.lat, lng: HOME.lng, label: HOME.label, source: 'device' };
}

/** Manual fallback when the user declines location access. */
export async function lookupArea(text) {
  await wait();
  const label = text.trim() || 'Downtown San José';
  return { lat: HOME.lat, lng: HOME.lng, label, source: 'manual' };
}
