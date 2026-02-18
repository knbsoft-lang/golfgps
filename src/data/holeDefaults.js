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

/** Export ALL defaults (every hole) as a JSON string you can copy/paste */
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

/** Import defaults from JSON string (overwrites existing keys with imported ones) */
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

    merged[holeKey] = {
      A: data?.A ? { x: clamp01(data.A.x), y: clamp01(data.A.y) } : undefined,
      C: data?.C ? { x: clamp01(data.C.x), y: clamp01(data.C.y) } : undefined,
      B: data?.B ? { x: clamp01(data.B.x), y: clamp01(data.B.y) } : undefined,
      Bactive: !!data?.Bactive,
    };
    count++;
  }

  writeAll(merged);
  return { ok: true, imported: count };
}

/** (Optional) Clear everything */
export function clearAllDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
