// src/lib/geo.js

const R = 6371000; // meters

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

export function haversineMeters(a, b) {
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat);
  const Δλ = toRad(b.lon - a.lon);

  const s =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function metersToYards(m) {
  return m * 1.0936133;
}

export function roundYards(y) {
  if (!Number.isFinite(y)) return null;
  return Math.round(y);
}

/**
 * Returns a "target point" that is `targetMeters` from tee toward green,
 * following a great-circle path (accurate enough for golf distances).
 */
export function pointAlongGreatCircle(tee, green, targetMeters) {
  const φ1 = toRad(tee.lat);
  const λ1 = toRad(tee.lon);
  const φ2 = toRad(green.lat);
  const λ2 = toRad(green.lon);

  const d = haversineMeters(tee, green);
  if (!Number.isFinite(d) || d <= 0) return { lat: tee.lat, lon: tee.lon };

  // Clamp target to [0, d]
  const t = Math.max(0, Math.min(targetMeters, d));
  const f = t / d;

  // Spherical interpolation (slerp)
  const sinD = Math.sin(d / R);
  if (Math.abs(sinD) < 1e-12) return { lat: tee.lat, lon: tee.lon };

  const A = Math.sin((1 - f) * (d / R)) / sinD;
  const B = Math.sin(f * (d / R)) / sinD;

  const x =
    A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y =
    A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);

  const φi = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λi = Math.atan2(y, x);

  return { lat: toDeg(φi), lon: toDeg(λi) };
}
