// src/data/holeDefaults.js
// Stores per-hole A/C/B positions in localStorage.
// Key format: "BelleGlades-Calusa-01" etc.

export function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

const STORAGE_KEY = "golfgps_hole_defaults_v2";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore storage failures
  }
}

export function getHoleDefaults(holeKey) {
  const all = readAll();
  return all[holeKey] || null;
}

// data can contain: {A, C, B, Bactive}
export function setHoleDefaults(holeKey, data) {
  const all = readAll();

  all[holeKey] = {
    A: data?.A ? { x: clamp01(data.A.x), y: clamp01(data.A.y) } : undefined,
    C: data?.C ? { x: clamp01(data.C.x), y: clamp01(data.C.y) } : undefined,
    B: data?.B ? { x: clamp01(data.B.x), y: clamp01(data.B.y) } : undefined,
    Bactive: !!data?.Bactive,
  };

  writeAll(all);
}
