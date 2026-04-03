// src/data/holeDefaults.js
// Stores per-hole hidden A0/C0 positions in localStorage.

export function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}

const STORAGE_KEY = "golfgps_hole_defaults_a0c0_v1";

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

function normalizeData(data) {
  const a0 = data?.A0 || data?.A;
  const c0 = data?.C0 || data?.C;

  return {
    A0: a0 ? { x: clamp01(a0.x), y: clamp01(a0.y) } : undefined,
    C0: c0 ? { x: clamp01(c0.x), y: clamp01(c0.y) } : undefined,
  };
}

export function getHoleDefaults(holeKey) {
  const all = readAll();
  const raw = all[holeKey] || null;
  return raw ? normalizeData(raw) : null;
}

export function setHoleDefaults(holeKey, data) {
  const all = readAll();
  all[holeKey] = normalizeData(data);
  writeAll(all);
}

export function clearHoleDefaults(holeKey) {
  const all = readAll();
  if (holeKey && Object.prototype.hasOwnProperty.call(all, holeKey)) {
    delete all[holeKey];
    writeAll(all);
  }
}

export function exportAllDefaults() {
  const all = readAll();
  return JSON.stringify(
    {
      version: 1,
      storageKey: STORAGE_KEY,
      savedAt: new Date().toISOString(),
      holes: all,
    },
    null,
    2
  );
}

export function importAllDefaults(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { ok: false, error: "Invalid JSON (could not parse)" };
  }

  const holes = parsed?.holes;
  if (!holes || typeof holes !== "object") {
    return { ok: false, error: "JSON missing 'holes' object" };
  }

  const current = readAll();
  const merged = { ...current };

  let count = 0;

  for (const [holeKey, data] of Object.entries(holes)) {
    if (!holeKey) continue;
    if (!data || typeof data !== "object") continue;

    merged[holeKey] = normalizeData(data);
    count++;
  }

  writeAll(merged);
  return { ok: true, imported: count };
}

export function clearAllDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}