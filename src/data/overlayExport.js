const OVERLAY_EXPORT_STORAGE_KEY = "golfgps_overlayExport_v1";

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}

function round4(n) {
  return +clamp01(n).toFixed(4);
}

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadStore() {
  try {
    return safeParse(localStorage.getItem(OVERLAY_EXPORT_STORAGE_KEY), {});
  } catch {
    return {};
  }
}

function saveStore(store) {
  localStorage.setItem(OVERLAY_EXPORT_STORAGE_KEY, JSON.stringify(store));
}

function normalizeOverlayState(state) {
  if (!state || !state.A || !state.B || !state.C) return null;

  return {
    A: { x: round4(state.A.x), y: round4(state.A.y) },
    B: { x: round4(state.B.x), y: round4(state.B.y) },
    C: { x: round4(state.C.x), y: round4(state.C.y) },
  };
}

export function getOverlayExportStore() {
  return loadStore();
}

export function saveOverlayForHole(courseKey, nineName, holeNumber, state) {
  if (!courseKey || !nineName || holeNumber == null) return null;

  const overlay = normalizeOverlayState(state);
  if (!overlay) return null;

  const store = loadStore();

  if (!store[courseKey]) store[courseKey] = {};
  if (!store[courseKey][nineName]) store[courseKey][nineName] = {};

  store[courseKey][nineName][String(holeNumber)] = overlay;
  saveStore(store);

  return overlay;
}

export function clearOverlayForHole(courseKey, nineName, holeNumber) {
  if (!courseKey || !nineName || holeNumber == null) return false;

  const store = loadStore();
  if (!store[courseKey]?.[nineName]?.[String(holeNumber)]) return false;

  delete store[courseKey][nineName][String(holeNumber)];

  if (Object.keys(store[courseKey][nineName]).length === 0) {
    delete store[courseKey][nineName];
  }
  if (Object.keys(store[courseKey]).length === 0) {
    delete store[courseKey];
  }

  saveStore(store);
  return true;
}

export function getSavedOverlayForHole(courseKey, nineName, holeNumber) {
  const store = loadStore();
  return store?.[courseKey]?.[nineName]?.[String(holeNumber)] || null;
}

export function getSavedCountForNine(courseKey, nineName) {
  const store = loadStore();
  return Object.keys(store?.[courseKey]?.[nineName] || {}).length;
}

export function getSavedCountForCourse(courseKey) {
  const store = loadStore();
  const course = store?.[courseKey] || {};
  return Object.values(course).reduce((sum, holesObj) => {
    return sum + Object.keys(holesObj || {}).length;
  }, 0);
}

export function buildExportForNine(courseKey, nineName) {
  const store = loadStore();
  const holes = store?.[courseKey]?.[nineName] || {};

  if (!Object.keys(holes).length) return null;

  return {
    [courseKey]: {
      [nineName]: holes,
    },
  };
}

export function buildExportForCourse(courseKey) {
  const store = loadStore();
  const course = store?.[courseKey] || {};

  if (!Object.keys(course).length) return null;

  return {
    [courseKey]: course,
  };
}

function safeFilePart(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "");
}

export function downloadOverlayJson(data, fileNameBase = "overlay_export") {
  if (!data) return false;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFilePart(fileNameBase)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export function makeNineExportFileName(courseKey, nineName) {
  return `${safeFilePart(courseKey)}_${safeFilePart(nineName)}_overlay_export`;
}

export function makeCourseExportFileName(courseKey) {
  return `${safeFilePart(courseKey)}_course_overlay_export`;
}