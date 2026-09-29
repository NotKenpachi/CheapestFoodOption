const toRad = (d) => (d * Math.PI) / 180;

/** Great-circle distance in miles. */
export function distanceMiles(a, b) {
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rough city travel time: walk short hops, drive the rest. */
export function travelTime(miles) {
  if (miles <= 0.6) return { minutes: Math.max(2, Math.round(miles * 20)), mode: 'walk' };
  return { minutes: Math.round(miles * 3 + 3), mode: 'drive' };
}

export function centroid(points) {
  const n = points.length;
  return {
    lat: points.reduce((s, p) => s + p.lat, 0) / n,
    lng: points.reduce((s, p) => s + p.lng, 0) / n,
  };
}
