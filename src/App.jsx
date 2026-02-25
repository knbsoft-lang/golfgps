// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { COURSE_CATALOG } from "./data/courses";
import { haversineMeters, metersToYards, roundYards } from "./lib/geo";
import HoleOverlay from "./components/HoleOverlay";
import { holeImagePath } from "./data/holeImages";
import { getHoleDefaults } from "./data/holeDefaults";

const TEE_BOXES = ["Black", "Gold", "Blue", "White", "Green", "Red", "Friendly"];
const TEST_SYNC_ID = "TEST-18";

// ✅ AUTO BUILD ID (changes every time you run `npm run build`)
const BUILD_TEST_ID =
  typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "DEV-NO-BUILD-ID";

function defaultParForHole(holeNumber) {
  const cycle = [4, 3, 5];
  const idx = Math.max(0, (holeNumber || 1) - 1) % cycle.length;
  return cycle[idx];
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function distNorm(p1, p2) {
  const dx = (p2?.x ?? 0) - (p1?.x ?? 0);
  const dy = (p2?.y ?? 0) - (p1?.y ?? 0);
  return Math.hypot(dx, dy);
}

function buildRound(club, mode, nineA, nineB) {
  const nines = club?.nines || {};
  const nineAList = nines[nineA] || [];
  const nineBList = nines[nineB] || [];

  if (!club || !nineA) return [];

  if (mode === "9") {
    return nineAList.map((h) => ({
      displayHole: h.hole,
      nine: nineA,
      ...h,
    }));
  }

  if (!nineB) return [];

  const front = nineAList.map((h) => ({
    displayHole: h.hole,
    nine: nineA,
    ...h,
  }));

  const back = nineBList.map((h) => ({
    displayHole: h.hole + 9,
    nine: nineB,
    hole: h.hole,
    tee: h.tee,
    green: h.green,
    par: h.par,
    hcp: h.hcp,
  }));

  return [...front, ...back];
}

/**
 * Bearing-based projection (great-circle-ish) to compute progress along Tee->Green.
 * Returns t in [0..1]
 */
function projectAlongTeeGreen(tee, green, pos) {
  if (!tee || !green || !pos) return null;

  const toRad = (d) => (d * Math.PI) / 180;

  const bearingRad = (p1, p2) => {
    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);
    const dLon = toRad(p2.lon - p1.lon);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return Math.atan2(y, x);
  };

  const angleDiff = (a, b) => {
    let d = a - b;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  };

  const dTG = haversineMeters(tee, green);
  if (!isFinite(dTG) || dTG < 0.5) return 0;

  const dTP = haversineMeters(tee, pos);
  if (!isFinite(dTP) || dTP < 0) return 0;

  const brgTG = bearingRad(tee, green);
  const brgTP = bearingRad(tee, pos);

  const dAng = angleDiff(brgTG, brgTP);
  const along = dTP * Math.cos(dAng);

  const t = along / dTG;
  return Math.max(0, Math.min(1, t));
}

/**
 * Cross-track using local flat approximation near tee.
 * Returns signed cross meters: +RIGHT, -LEFT relative to tee->green.
 */
function crossTrackMetersRightPositive(tee, green, pos) {
  if (!tee || !green || !pos) return null;

  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;

  const lat0 = toRad(tee.lat);
  const dLatG = toRad(green.lat - tee.lat);
  const dLonG = toRad(green.lon - tee.lon);
  const dLatP = toRad(pos.lat - tee.lat);
  const dLonP = toRad(pos.lon - tee.lon);

  const ACx = dLonG * Math.cos(lat0) * R;
  const ACy = dLatG * R;

  const APx = dLonP * Math.cos(lat0) * R;
  const APy = dLatP * R;

  const len = Math.hypot(ACx, ACy);
  if (!isFinite(len) || len < 0.5) return null;

  const z = ACx * APy - ACy * APx; // + => LEFT (math)
  const crossMeters = -z / len; // flip => +RIGHT

  return crossMeters;
}

function ArrowYardBox({ top, yards, left = 0 }) {
  const W = 70;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: W,
        padding: "8px 9px",
        background: "rgba(255,255,255,0.98)",
        color: "#000",
        border: "2px solid #000",
        outline: "3px solid rgba(0,0,0,0.60)",
        outlineOffset: 1,
        borderRadius: "0 14px 14px 0",
        boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
        pointerEvents: "none",
        zIndex: 6,
        clipPath:
          "polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <div style={{ fontSize: 24, fontWeight: 950, lineHeight: 1.0 }}>
          {typeof yards === "number" ? yards : "—"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 900, opacity: 0.95 }}>yd</div>
      </div>
    </div>
  );
}

function SelectBox({ value, onChange, placeholder, options, disabled = false }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px 10px",
        borderRadius: 10,
        border: "1px solid #333",
        background: disabled ? "#1a1a1a" : "white",
        color: disabled ? "rgba(255,255,255,0.35)" : "black",
        fontWeight: 900,
        fontSize: 17,
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}

// ===== Tee/Green Override storage (per hole + tee box) =====
function tgOverrideKey(clubKey, nineName, holeNum, teeBox) {
  const ck = (clubKey || "").replace(/\s+/g, "");
  const nk = (nineName || "").replace(/\s+/g, "");
  const hb = String(holeNum ?? "").padStart(2, "0");
  const tb = (teeBox || "Unknown").replace(/\s+/g, "");
  return `golfgps_tgOverride_${ck}-${nk}-${hb}-${tb}`;
}

function loadTGOverride(clubKey, nineName, holeNum, teeBox) {
  try {
    const key = tgOverrideKey(clubKey, nineName, holeNum, teeBox);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTGOverride(clubKey, nineName, holeNum, teeBox, patch) {
  const key = tgOverrideKey(clubKey, nineName, holeNum, teeBox);
  const prev = loadTGOverride(clubKey, nineName, holeNum, teeBox) || {};
  const next = { ...prev, ...patch };
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {}
  return next;
}

function resetTGOverrideField(clubKey, nineName, holeNum, teeBox, field /* 'tee' | 'green' */) {
  const key = tgOverrideKey(clubKey, nineName, holeNum, teeBox);
  const prev = loadTGOverride(clubKey, nineName, holeNum, teeBox) || {};
  if (!prev || typeof prev !== "object") return null;

  const next = { ...prev };
  delete next[field];

  // if nothing left, remove key entirely
  const hasAny =
    (next.tee && typeof next.tee === "object") ||
    (next.green && typeof next.green === "object");

  try {
    if (hasAny) localStorage.setItem(key, JSON.stringify(next));
    else localStorage.removeItem(key);
  } catch {}

  return hasAny ? next : null;
}

// ===== Backup Export/Import (ALL golfgps_* keys) =====
function collectGolfGpsStorage() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("golfgps_")) out[k] = localStorage.getItem(k);
    }
  } catch {}
  return out;
}

function downloadTextFile(filename, text, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function App() {
  const [page, setPage] = useState("home");

  const clubKeysAll = Object.keys(COURSE_CATALOG);

  const [courseType, setCourseType] = useState("");
  const [clubKey, setClubKey] = useState("");
  const [teeBox, setTeeBox] = useState("");

  const filteredClubKeys = useMemo(() => {
    if (!courseType) return [];
    return clubKeysAll.filter((k) => {
      const t = COURSE_CATALOG[k]?.courseType || "Championship";
      return t === courseType;
    });
  }, [courseType, clubKeysAll]);

  const club = clubKey ? COURSE_CATALOG[clubKey] : null;
  const nineNames = useMemo(() => Object.keys(club?.nines || {}), [club]);

  const [mode, setMode] = useState("");
  const [nineA, setNineA] = useState("");
  const [nineB, setNineB] = useState("");

  useEffect(() => {
    setClubKey("");
    setMode("");
    setNineA("");
    setNineB("");
    setTeeBox("");
    setPage("home");
  }, [courseType]);

  useEffect(() => {
    setMode("");
    setNineA("");
    setNineB("");
    setTeeBox("");
    setPage("home");

    if (!clubKey) return;

    const nn = Object.keys(
      (COURSE_CATALOG[clubKey] && COURSE_CATALOG[clubKey].nines) || {}
    );

    if (courseType === "Executive") {
      setMode("9");
      setNineA(nn[0] || "");
      setNineB(nn[0] || "");
      return;
    }
  }, [clubKey, courseType]);

  useEffect(() => {
    if (courseType !== "Championship") return;
    if (!mode) {
      setNineA("");
      setNineB("");
      return;
    }
    setNineA("");
    setNineB("");
  }, [mode, courseType]);

  useEffect(() => {
    if (courseType !== "Championship") return;
    if (!clubKey) return;
    if (!nineNames.length) return;

    if (mode === "18") {
      if (nineB && nineA && nineB === nineA) setNineB("");
    } else if (mode === "9") {
      setNineB("");
    }
  }, [clubKey, nineNames, mode, nineA, nineB, courseType]);

  const roundHoles = useMemo(
    () => buildRound(club, mode, nineA, nineB),
    [club, mode, nineA, nineB]
  );

  const [idx, setIdx] = useState(0);
  const hole = roundHoles[idx];

  useEffect(() => setIdx(0), [courseType, clubKey, mode, nineA, nineB]);

  const [startHoleDisplay, setStartHoleDisplay] = useState("1");
  useEffect(
    () => setStartHoleDisplay("1"),
    [courseType, clubKey, mode, nineA, nineB]
  );

  const imgSrc =
    hole && clubKey ? holeImagePath(clubKey, hole.nine, hole.hole) : null;

  const holeKey =
    hole && clubKey
      ? `${clubKey.replace(/\s+/g, "")}-${hole.nine}-${String(hole.hole).padStart(
          2,
          "0"
        )}`
      : "";

  // ========= GPS =========
  const [pos, setPos] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("GPS not started");
  const watchIdRef = useRef(null);
  const pollTimerRef = useRef(null);

  const [fixCount, setFixCount] = useState(0);
  const [lastFixMs, setLastFixMs] = useState(0);

  function applyFix(p) {
    setPos({
      lat: p.coords.latitude,
      lon: p.coords.longitude,
      accuracyMeters: p.coords.accuracy,
    });
    setGpsStatus(`GPS locked (${Math.round(p.coords.accuracy)}m)`);
    setFixCount((c) => c + 1);
    setLastFixMs(Date.now());
  }

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGpsStatus("Geolocation not supported");
      return;
    }

    const opts = { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => applyFix(p),
      (err) => setGpsStatus(`GPS error: ${err.message}`),
      opts
    );

    pollTimerRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (p) => applyFix(p),
        () => {},
        opts
      );
    }, 1000);

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const prevHole = () =>
    setIdx((v) => clamp(v - 1, 0, Math.max(0, roundHoles.length - 1)));
  const nextHole = () =>
    setIdx((v) => clamp(v + 1, 0, Math.max(0, roundHoles.length - 1)));

  // ===== Per-hole Tee/Green overrides (localStorage) =====
  const [tgRev, setTgRev] = useState(0);

  const holeNum = hole?.hole ?? null;
  const holeNine = hole?.nine ?? null;

  const tgOverride = useMemo(() => {
    if (!clubKey || !holeNine || !holeNum || !teeBox) return null;
    return loadTGOverride(clubKey, holeNine, holeNum, teeBox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubKey, holeNine, holeNum, teeBox, tgRev]);

  const teeLL = tgOverride?.tee ?? hole?.tee ?? null;
  const greenLL = tgOverride?.green ?? hole?.green ?? null;

  function handleUpdateTeeFromGPS() {
    if (!hole || !clubKey || !teeBox) return;
    if (!pos?.lat || !pos?.lon) return;

    if (pos?.accuracyMeters != null && pos.accuracyMeters > 25) {
      window.alert(
        `GPS accuracy is LOW (${Math.round(
          pos.accuracyMeters
        )}m).\nWait for better accuracy, then try again.`
      );
      return;
    }

    saveTGOverride(clubKey, hole.nine, hole.hole, teeBox, {
      tee: { lat: pos.lat, lon: pos.lon },
    });
    setTgRev((n) => n + 1);

    window.alert(
      `Saved TEE override\n${clubKey} / ${hole.nine} / Hole ${hole.hole} / ${teeBox}\nLat ${pos.lat}\nLon ${pos.lon}`
    );
  }

  function handleUpdateGreenFromGPS() {
    if (!hole || !clubKey || !teeBox) return;
    if (!pos?.lat || !pos?.lon) return;

    if (pos?.accuracyMeters != null && pos.accuracyMeters > 25) {
      window.alert(
        `GPS accuracy is LOW (${Math.round(
          pos.accuracyMeters
        )}m).\nWait for better accuracy, then try again.`
      );
      return;
    }

    saveTGOverride(clubKey, hole.nine, hole.hole, teeBox, {
      green: { lat: pos.lat, lon: pos.lon },
    });
    setTgRev((n) => n + 1);

    window.alert(
      `Saved GREEN override\n${clubKey} / ${hole.nine} / Hole ${hole.hole} / ${teeBox}\nLat ${pos.lat}\nLon ${pos.lon}`
    );
  }

  function handleResetTeeOverride() {
    if (!hole || !clubKey || !teeBox) return;
    const ok = window.confirm(
      `Reset TEE override for:\n${clubKey} / ${hole.nine} / Hole ${hole.hole} / ${teeBox}\n\nThis only affects THIS hole+tee box.`
    );
    if (!ok) return;
    resetTGOverrideField(clubKey, hole.nine, hole.hole, teeBox, "tee");
    setTgRev((n) => n + 1);
    window.alert("TEE override reset for this hole.");
  }

  function handleResetGreenOverride() {
    if (!hole || !clubKey || !teeBox) return;
    const ok = window.confirm(
      `Reset GREEN override for:\n${clubKey} / ${hole.nine} / Hole ${hole.hole} / ${teeBox}\n\nThis only affects THIS hole+tee box.`
    );
    if (!ok) return;
    resetTGOverrideField(clubKey, hole.nine, hole.hole, teeBox, "green");
    setTgRev((n) => n + 1);
    window.alert("GREEN override reset for this hole.");
  }

  // ===== Export / Import =====
  const importFileInputRef = useRef(null);

  function handleExportBackup() {
    const data = {
      meta: {
        app: "GolfGPS",
        version: "backup-v1",
        date: new Date().toISOString(),
        testSyncId: TEST_SYNC_ID,
        buildId: BUILD_TEST_ID,
      },
      localStorage: collectGolfGpsStorage(),
    };

    const json = JSON.stringify(data, null, 2);
    const fname = `GolfGPS_Backup_${todayYMD()}.json`;
    downloadTextFile(fname, json);
    window.alert(
      `Backup exported:\n${fname}\n\nIt is saved in Downloads.\nCopy it to your PC for safekeeping.`
    );
  }

  function handleClickImport() {
    importFileInputRef.current?.click?.();
  }

  async function handleImportSelectedFile(e) {
    const f = e.target.files?.[0] || null;
    e.target.value = ""; // allow selecting same file again later
    if (!f) return;

    try {
      const text = await f.text();
      const parsed = JSON.parse(text);

      const bag = parsed?.localStorage;
      if (!bag || typeof bag !== "object") {
        window.alert("Import failed: file does not contain localStorage data.");
        return;
      }

      const keys = Object.keys(bag).filter((k) => k.startsWith("golfgps_"));
      if (!keys.length) {
        window.alert("Import failed: no golfgps_* keys found in this file.");
        return;
      }

      const ok = window.confirm(
        `Import ${keys.length} items into tablet storage?\n\nThis will OVERWRITE any matching golfgps_* keys on this tablet.\n\nPress OK to import.`
      );
      if (!ok) return;

      let written = 0;
      for (const k of keys) {
        try {
          localStorage.setItem(k, String(bag[k]));
          written++;
        } catch {}
      }

      // refresh dependent memoized reads
      setTgRev((n) => n + 1);

      window.alert(
        `Import complete.\nWrote ${written} keys.\n\nTip: If you are currently on PLAY, go HOME then PLAY again to refresh any visuals.`
      );
    } catch (err) {
      window.alert(`Import failed: ${err?.message || String(err)}`);
    }
  }

  const teeToGreenYards = useMemo(() => {
    if (!teeLL || !greenLL) return null;
    return roundYards(metersToYards(haversineMeters(teeLL, greenLL)));
  }, [teeLL, greenLL]);

  const youToGreenYards = useMemo(() => {
    if (!greenLL || !pos) return null;
    return roundYards(metersToYards(haversineMeters(pos, greenLL)));
  }, [pos, greenLL]);

  const youToHoleYards = useMemo(() => {
    if (!teeLL || !greenLL || !pos) return null;
    const ydT = roundYards(metersToYards(haversineMeters(pos, teeLL)));
    const ydG = roundYards(metersToYards(haversineMeters(pos, greenLL)));
    return Math.min(ydT, ydG);
  }, [pos, teeLL, greenLL]);

  // ========= Par + SI =========
  const parValue =
    typeof hole?.par === "number"
      ? hole.par
      : defaultParForHole(hole?.displayHole || hole?.hole || 1);

  const siValue = typeof hole?.hcp === "number" ? hole.hcp : null;

  const parText = `Par ${parValue}`;
  const siText = `SI ${siValue ?? "—"}`;

  // ========= Overlay live state =========
  const [liveOverlay, setLiveOverlay] = useState(null);
  useEffect(() => setLiveOverlay(null), [holeKey]);

  const overlayActionsRef = useRef(null);
  const [setupEnabled, setSetupEnabled] = useState(false);

  // ========= BASELINE =========
  const savedDefaults = useMemo(() => {
    return holeKey ? getHoleDefaults(holeKey) : null;
  }, [holeKey]);

  const [baselineAC, setBaselineAC] = useState(null);

  useEffect(() => {
    if (!holeKey) {
      setBaselineAC(null);
      return;
    }
    if (savedDefaults?.A && savedDefaults?.C) {
      setBaselineAC({ A: savedDefaults.A, C: savedDefaults.C });
    } else {
      setBaselineAC(null);
    }
  }, [holeKey, savedDefaults]);

  useEffect(() => {
    if (baselineAC) return;
    if (!liveOverlay?.A || !liveOverlay?.C) return;
    setBaselineAC({ A: liveOverlay.A, C: liveOverlay.C });
  }, [baselineAC, liveOverlay]);

  const baselineLen = useMemo(() => {
    if (!baselineAC?.A || !baselineAC?.C) return null;
    const d = distNorm(baselineAC.A, baselineAC.C);
    return d > 0.0001 ? d : null;
  }, [baselineAC]);

  const yardsPerNormUnit = useMemo(() => {
    if (typeof teeToGreenYards !== "number") return null;
    if (!baselineLen) return null;
    return teeToGreenYards / baselineLen;
  }, [teeToGreenYards, baselineLen]);

  const A = liveOverlay?.A || baselineAC?.A || null;
  const C = liveOverlay?.C || baselineAC?.C || null;
  const Bactive = !!liveOverlay?.Bactive;
  const B = liveOverlay?.B || null;

  // ========= Cross calibration storage =========
  const crossCalKey = holeKey ? `golfgps_crossCal_${holeKey}` : "";
  const [crossCalScale, setCrossCalScale] = useState(1.0);

  useEffect(() => {
    if (!crossCalKey) return;
    try {
      const raw = localStorage.getItem(crossCalKey);
      const v = raw != null ? parseFloat(raw) : NaN;
      if (isFinite(v) && v > 0.01 && v < 10) setCrossCalScale(v);
      else setCrossCalScale(1.0);
    } catch {
      setCrossCalScale(1.0);
    }
  }, [crossCalKey]);

  function saveCrossCalScale(v) {
    if (!crossCalKey) return;
    try {
      localStorage.setItem(crossCalKey, String(v));
    } catch {}
    setCrossCalScale(v);
  }

  function resetCrossCal() {
    if (!crossCalKey) return;
    try {
      localStorage.removeItem(crossCalKey);
    } catch {}
    setCrossCalScale(1.0);
  }

  const teeToTargetYards = useMemo(() => {
    if (!yardsPerNormUnit) return null;
    if (!A || !B || !Bactive) return null;
    return roundYards(distNorm(A, B) * yardsPerNormUnit);
  }, [yardsPerNormUnit, A, B, Bactive]);

  const targetToGreenYards = useMemo(() => {
    if (!yardsPerNormUnit) return null;
    if (!B || !C || !Bactive) return null;
    return roundYards(distNorm(B, C) * yardsPerNormUnit);
  }, [yardsPerNormUnit, B, C, Bactive]);

  const modeledTotalYards = useMemo(() => {
    if (!yardsPerNormUnit || !A || !C) return null;

    if (!Bactive || !B) {
      return roundYards(distNorm(A, C) * yardsPerNormUnit);
    }
    return roundYards((distNorm(A, B) + distNorm(B, C)) * yardsPerNormUnit);
  }, [yardsPerNormUnit, A, B, C, Bactive]);

  const YOU_SHOW_WITHIN_YARDS = 1200;
  const [crossOffsetOn, setCrossOffsetOn] = useState(true);

  const crossRawYardsSigned = useMemo(() => {
    if (!teeLL || !greenLL || !pos) return null;
    const crossM = crossTrackMetersRightPositive(teeLL, greenLL, pos);
    if (typeof crossM !== "number" || !isFinite(crossM)) return null;
    const yd = metersToYards(crossM);
    const r = Math.round(yd);
    if (Math.abs(r) <= 1) return 0;
    return r;
  }, [teeLL, greenLL, pos]);

  const crossScaledYardsSigned = useMemo(() => {
    if (crossRawYardsSigned == null) return null;
    if (crossRawYardsSigned === 0) return 0;
    const v = Math.round(crossRawYardsSigned * crossCalScale);
    if (Math.abs(v) <= 1) return 0;
    return v;
  }, [crossRawYardsSigned, crossCalScale]);

  const crossText = useMemo(() => {
    if (crossScaledYardsSigned == null) return "—";
    if (crossScaledYardsSigned === 0) return "0 yd";
    const side = crossScaledYardsSigned > 0 ? "RIGHT" : "LEFT";
    const sign = crossScaledYardsSigned > 0 ? "+" : "−";
    return `${sign}${Math.abs(crossScaledYardsSigned)} yd (${side})`;
  }, [crossScaledYardsSigned]);

  const crossRawText = useMemo(() => {
    if (crossRawYardsSigned == null) return "—";
    if (crossRawYardsSigned === 0) return "0 yd";
    const side = crossRawYardsSigned > 0 ? "RIGHT" : "LEFT";
    const sign = crossRawYardsSigned > 0 ? "+" : "−";
    return `${sign}${Math.abs(crossRawYardsSigned)} yd (${side})`;
  }, [crossRawYardsSigned]);

  // Base point on overlay centerline + perpendicular direction (RIGHT)
  const basePointAndPerp = useMemo(() => {
    if (!teeLL || !greenLL || !pos || !A || !C) return null;

    const t = projectAlongTeeGreen(teeLL, greenLL, pos);
    if (typeof t !== "number") return null;

    const base = {
      x: A.x + (C.x - A.x) * t,
      y: A.y + (C.y - A.y) * t,
    };

    const dx = C.x - A.x;
    const dy = C.y - A.y;
    const len = Math.hypot(dx, dy);
    if (!isFinite(len) || len < 0.0001) return { base, perpRight: { x: 0, y: 0 } };

    // Perp RIGHT in screen coords (x right, y down)
    const perpRight = { x: -dy / len, y: dx / len };

    return { base, perpRight };
  }, [teeLL, greenLL, pos, A, C]);

  // YOU dot (centerline + optional offset)
  const youNorm = useMemo(() => {
    if (!teeLL || !greenLL || !pos || !A || !C) return null;

    if (
      typeof youToHoleYards === "number" &&
      youToHoleYards > YOU_SHOW_WITHIN_YARDS
    ) {
      return null;
    }

    if (!basePointAndPerp) return null;

    const { base, perpRight } = basePointAndPerp;

    if (!crossOffsetOn) return base;
    if (!yardsPerNormUnit) return base;
    if (typeof crossScaledYardsSigned !== "number") return base;

    const normUnitsPerYard = 1 / yardsPerNormUnit;
    const offsetNorm = crossScaledYardsSigned * normUnitsPerYard;

    return {
      x: clamp01(base.x + perpRight.x * offsetNorm),
      y: clamp01(base.y + perpRight.y * offsetNorm),
    };
  }, [
    teeLL,
    greenLL,
    pos,
    A,
    C,
    youToHoleYards,
    basePointAndPerp,
    crossOffsetOn,
    yardsPerNormUnit,
    crossScaledYardsSigned,
  ]);

  // ✅ CALIBRATION ACTION
  function calibrateUsingTargetB() {
    if (!basePointAndPerp) {
      window.alert("Calibrate failed: no base point yet (need GPS + A/C).");
      return;
    }
    if (!yardsPerNormUnit) {
      window.alert("Calibrate failed: yards scale not ready yet.");
      return;
    }
    if (!Bactive || !B) {
      window.alert(
        "Calibrate failed: you must set Target B and drag it to your landmark."
      );
      return;
    }
    if (typeof crossRawYardsSigned !== "number" || crossRawYardsSigned === 0) {
      window.alert("Calibrate failed: cross raw not available yet.");
      return;
    }

    const { base, perpRight } = basePointAndPerp;

    const vx = B.x - base.x;
    const vy = B.y - base.y;
    const offsetNormSigned = vx * perpRight.x + vy * perpRight.y;

    const normUnitsPerYard = 1 / yardsPerNormUnit;
    const offsetYardsSigned = offsetNormSigned / normUnitsPerYard;

    const scale = offsetYardsSigned / crossRawYardsSigned;

    if (!isFinite(scale) || Math.abs(scale) < 0.01 || Math.abs(scale) > 10) {
      window.alert(
        `Calibrate failed: scale looks crazy (${scale}). Try again with B placed exactly on landmark.`
      );
      return;
    }

    saveCrossCalScale(scale);
    window.alert(
      `Saved cross calibration for this hole.\nScale = ${scale.toFixed(3)}`
    );
  }

  const FOOTER_H = 60;
  const TOP_BTN_TOP = 40;
  const TOP_BTN_W = 92;
  const TOP_BTN_H = 44;

  const ARROW_LEFT = 80;
  const ARROW_TOP_BC = 240;
  const ARROW_TOP_AB = 640;
  const ARROW_TOP_AC = 260;

  const holeNumberText =
    hole?.displayHole != null
      ? String(hole.displayHole).padStart(2, "0")
      : "—";

  const roundReady = useMemo(() => {
    if (!courseType) return false;
    if (!clubKey) return false;
    if (!teeBox) return false;

    if (courseType === "Executive") return true;

    if (!mode) return false;
    if (!nineA) return false;
    if (mode === "18" && !nineB) return false;

    return true;
  }, [courseType, clubKey, teeBox, mode, nineA, nineB]);

  function enterSetup() {
    if (setupEnabled) return;
    const pw = window.prompt("Enter setup password:");
    if (pw === "golfgps") setSetupEnabled(true);
  }

  function goPlay() {
    if (!roundReady) return;

    const desired = parseInt(startHoleDisplay || "1", 10);
    const i = roundHoles.findIndex((h) => h.displayHole === desired);
    setIdx(i >= 0 ? i : 0);

    setPage("play");
  }

  function goHome() {
    setPage("home");
  }

  function handleSaveDefaults() {
    overlayActionsRef.current?.saveDefaults?.();
    const st = overlayActionsRef.current?.getState?.();
    if (st?.A && st?.C) setBaselineAC({ A: st.A, C: st.C });
  }

  function handleClearTarget() {
    overlayActionsRef.current?.clearTarget?.();
  }

  const fixAgeSec =
    lastFixMs > 0
      ? Math.max(0, Math.round((Date.now() - lastFixMs) / 1000))
      : null;

  return (
    <div
      style={{
        fontFamily: "system-ui",
        color: "white",
        background: "#0b0b0b",
        minHeight: "100vh",
      }}
    >
      {/* Hidden file input for Import */}
      <input
        ref={importFileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportSelectedFile}
        style={{ display: "none" }}
      />

      {/* HOME PAGE */}
      {page === "home" && (
        <div style={{ padding: "14px 16px 16px 16px", maxWidth: 720 }}>
          <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 10 }}>
            Golf GPS
          </div>

          <div
            style={{
              border: "1px solid #222",
              borderRadius: 14,
              background: "#101010",
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 10, opacity: 0.95 }}>
              Selections
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SelectBox
                value={courseType}
                onChange={setCourseType}
                placeholder="Course Type"
                options={["Executive", "Championship"]}
              />

              {courseType && (
                <SelectBox
                  value={clubKey}
                  onChange={setClubKey}
                  placeholder="Course"
                  options={filteredClubKeys}
                />
              )}

              {courseType === "Executive" && clubKey && (
                <SelectBox
                  value={teeBox}
                  onChange={setTeeBox}
                  placeholder="Tee Box"
                  options={TEE_BOXES}
                />
              )}

              {courseType === "Championship" && clubKey && (
                <>
                  <SelectBox
                    value={mode}
                    onChange={setMode}
                    placeholder="9 or 18"
                    options={[
                      { value: "9", label: "9 holes" },
                      { value: "18", label: "18 holes" },
                    ]}
                  />

                  {mode && (
                    <SelectBox
                      value={nineA}
                      onChange={setNineA}
                      placeholder="First 9 holes"
                      options={nineNames}
                    />
                  )}

                  {mode === "18" && nineA && (
                    <SelectBox
                      value={nineB}
                      onChange={setNineB}
                      placeholder="Second 9 holes"
                      options={nineNames.filter((n) => n !== nineA)}
                    />
                  )}

                  {((mode === "9" && nineA) ||
                    (mode === "18" && nineA && nineB)) && (
                    <SelectBox
                      value={teeBox}
                      onChange={setTeeBox}
                      placeholder="Tee Box"
                      options={TEE_BOXES}
                    />
                  )}
                </>
              )}

              {roundReady && roundHoles.length > 0 && (
                <SelectBox
                  value={startHoleDisplay}
                  onChange={setStartHoleDisplay}
                  placeholder="Starting Hole"
                  options={roundHoles.map((h) => ({
                    value: String(h.displayHole),
                    label: `Start Hole ${String(h.displayHole).padStart(
                      2,
                      "0"
                    )} (${h.nine})`,
                  }))}
                />
              )}
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 10,
                border: "1px solid #222",
                borderRadius: 12,
                background: "#0d0d0d",
                lineHeight: 1.5,
                fontSize: 13,
                opacity: 0.95,
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>
                {gpsStatus}
              </div>
              <div style={{ opacity: 0.9 }}>
                Tip: GPS lock may take 10–30 seconds after Airplane Mode.
              </div>
            </div>

            <button
              onClick={goPlay}
              disabled={!roundReady}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "14px 14px",
                borderRadius: 14,
                border: "1px solid #333",
                background: roundReady ? "white" : "#1a1a1a",
                color: roundReady ? "black" : "rgba(255,255,255,0.35)",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              PLAY
            </button>
          </div>
        </div>
      )}

      {/* PLAY PAGE */}
      {page === "play" && (
        <>
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              right: 0,
              bottom: FOOTER_H,
              background: "#0b0b0b",
              overflow: "hidden",
            }}
          >
            {/* Arrow boxes */}
            {!Bactive && (
              <ArrowYardBox
                left={ARROW_LEFT}
                top={ARROW_TOP_AC}
                yards={
                  typeof modeledTotalYards === "number"
                    ? modeledTotalYards
                    : teeToGreenYards
                }
              />
            )}
            {Bactive && (
              <ArrowYardBox
                left={ARROW_LEFT}
                top={ARROW_TOP_BC}
                yards={targetToGreenYards}
              />
            )}
            {Bactive && (
              <ArrowYardBox
                left={ARROW_LEFT}
                top={ARROW_TOP_AB}
                yards={teeToTargetYards}
              />
            )}

            {/* Overlay + YOU dot */}
            {imgSrc ? (
              <HoleOverlay
                imageSrc={imgSrc}
                resetKey={`${clubKey}-${hole?.nine}-${hole?.hole}-${hole?.displayHole}`}
                holeKey={holeKey}
                setupEnabled={setupEnabled}
                allowPlayB={true}
                youNorm={youNorm}
                youAccuracyMeters={pos?.accuracyMeters ?? null}
                onStateChange={(state) => setLiveOverlay(state)}
                onActionsReady={(actions) => {
                  overlayActionsRef.current = actions;
                }}
              />
            ) : (
              <div style={{ padding: 12, color: "white" }}>No image</div>
            )}

            {/* GPS DEBUG */}
            <div
              style={{
                position: "fixed",
                right: 10,
                bottom: FOOTER_H + 10,
                padding: "8px 10px",
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.55)",
                fontSize: 12,
                lineHeight: 1.25,
                zIndex: 10002,
                pointerEvents: "auto",
                userSelect: "none",
                width: 200,
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 4 }}>GPS</div>

              <div>
                Lat: <b>{pos?.lat != null ? pos.lat.toFixed(6) : "—"}</b>
              </div>
              <div>
                Lon: <b>{pos?.lon != null ? pos.lon.toFixed(6) : "—"}</b>
              </div>

              <div style={{ marginBottom: 6 }}>
                Sync: <b>{TEST_SYNC_ID}</b>
              </div>

              <div>
                Fixes: <b>{fixCount}</b>{" "}
                {fixAgeSec != null ? `(age ${fixAgeSec}s)` : ""}
              </div>

              <div>
                Acc:{" "}
                <b>
                  {pos?.accuracyMeters != null
                    ? `${Math.round(pos.accuracyMeters)}m`
                    : "—"}
                </b>
              </div>

              <div style={{ marginBottom: 6 }}>
                Trust:{" "}
                <b>
                  {pos?.accuracyMeters != null
                    ? pos.accuracyMeters <= 10
                      ? "HIGH"
                      : pos.accuracyMeters <= 25
                      ? "OK"
                      : "LOW"
                    : "—"}
                </b>
              </div>

              <div>
                Tee→Green:{" "}
                <b>{teeToGreenYards != null ? `${teeToGreenYards} yd` : "—"}</b>
              </div>

              <div>
                Cross: <b>{crossText}</b>
              </div>

              <div style={{ opacity: 0.85, marginTop: 2 }}>
                Raw: <b>{crossRawText}</b>
                <div style={{ marginTop: 2 }}>
                  Cal scale: <b>{crossCalScale.toFixed(3)}</b>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    opacity: 0.95,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={crossOffsetOn}
                    onChange={(e) => setCrossOffsetOn(e.target.checked)}
                  />
                  <span style={{ fontWeight: 800 }}>Offset dot</span>
                </label>
              </div>

              {/* ✅ Buttons stacked vertically */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  onClick={calibrateUsingTargetB}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "white",
                    fontWeight: 900,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Stand at landmark, drag Target B to the landmark on image, then press this"
                >
                  Calibrate (use Target B)
                </button>

                <button
                  onClick={resetCrossCal}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#f3f3f3",
                    fontWeight: 900,
                    fontSize: 12,
                    width: "100%",
                  }}
                >
                  Reset Cal
                </button>

                <button
                  onClick={handleUpdateTeeFromGPS}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "white",
                    fontWeight: 900,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Stand on tee (good accuracy), then save tee coordinates"
                >
                  Update Tee
                </button>

                <button
                  onClick={handleUpdateGreenFromGPS}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "white",
                    fontWeight: 900,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Stand near green center (good accuracy), then save green coordinates"
                >
                  Update Green
                </button>

                {/* NEW: Reset tee/green override (this hole only) */}
                <button
                  onClick={handleResetTeeOverride}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#f3f3f3",
                    fontWeight: 900,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Undo a bad tee save (this hole only)"
                >
                  Reset Tee Override
                </button>

                <button
                  onClick={handleResetGreenOverride}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#f3f3f3",
                    fontWeight: 900,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Undo a bad green save (this hole only)"
                >
                  Reset Green Override
                </button>

                {/* NEW: Export / Import */}
                <button
                  onClick={handleExportBackup}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "white",
                    fontWeight: 950,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Download a JSON backup of all saved golfgps_* data"
                >
                  Export Backup
                </button>

                <button
                  onClick={handleClickImport}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#f3f3f3",
                    fontWeight: 950,
                    fontSize: 12,
                    width: "100%",
                  }}
                  title="Import a previously exported JSON backup"
                >
                  Import Backup
                </button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.85 }}>
                Near hole: <b>{youToHoleYards != null ? `${youToHoleYards} yd` : "—"}</b>
              </div>
            </div>

            {/* HOME + SETUP */}
            <button
              onClick={goHome}
              style={{
                position: "fixed",
                left: 10,
                top: TOP_BTN_TOP,
                width: TOP_BTN_W,
                height: TOP_BTN_H,
                borderRadius: 12,
                border: "1px solid #333",
                background: "white",
                color: "black",
                fontWeight: 900,
                fontSize: 18 * 1.15,
                zIndex: 10000,
              }}
            >
              HOME
            </button>

            <button
              onClick={setupEnabled ? undefined : enterSetup}
              style={{
                position: "fixed",
                right: 10,
                top: TOP_BTN_TOP,
                width: TOP_BTN_W,
                height: TOP_BTN_H,
                borderRadius: 12,
                border: "1px solid #333",
                background: "white",
                color: "black",
                fontWeight: 900,
                fontSize: 18 * 1.15,
                zIndex: 10000,
                opacity: setupEnabled ? 0.8 : 1,
              }}
            >
              SETUP
            </button>

            {/* SETUP CONTROLS */}
            {setupEnabled && (
              <div
                style={{
                  position: "fixed",
                  left: 10,
                  right: 10,
                  top: 10,
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  zIndex: 10001,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(0,0,0,0.55)",
                    fontWeight: 900,
                    letterSpacing: 0.5,
                    fontSize: 13,
                    pointerEvents: "auto",
                  }}
                >
                  SETUP MODE
                </div>

                <button
                  onClick={handleSaveDefaults}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "white",
                    fontWeight: 900,
                    fontSize: 13,
                    pointerEvents: "auto",
                  }}
                >
                  Save Defaults
                </button>

                <button
                  onClick={handleClearTarget}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "white",
                    fontWeight: 900,
                    fontSize: 13,
                    pointerEvents: "auto",
                  }}
                >
                  Clear Target
                </button>

                <button
                  onClick={() => setSetupEnabled(false)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#f3f3f3",
                    fontWeight: 900,
                    fontSize: 13,
                    pointerEvents: "auto",
                  }}
                >
                  Exit Setup
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              height: FOOTER_H,
              background: "white",
              color: "black",
              borderTop: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10,
              zIndex: 9999,
              boxShadow: "0 -2px 10px rgba(0,0,0,0.10)",
            }}
          >
            <button
              onClick={prevHole}
              disabled={idx === 0}
              style={{
                width: 60,
                height: 44,
                borderRadius: 10,
                border: "1px solid #000",
                background: "white",
                color: "black",
                fontSize: 30,
                fontWeight: 900,
                lineHeight: "30px",
              }}
            >
              {"<"}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                minWidth: 270,
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 1 }}>
                {holeNumberText}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.05,
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 900, opacity: 0.95 }}>
                  You→Green {youToGreenYards ?? "—"} yd
                </div>
                <div style={{ fontSize: 17, fontWeight: 900, opacity: 0.95 }}>
                  {parText} • {siText}
                </div>
              </div>
            </div>

            <button
              onClick={nextHole}
              disabled={idx === roundHoles.length - 1}
              style={{
                width: 60,
                height: 44,
                borderRadius: 10,
                border: "1px solid #000",
                background: "white",
                color: "black",
                fontSize: 30,
                fontWeight: 900,
                lineHeight: "30px",
              }}
            >
              {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}