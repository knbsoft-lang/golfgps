import { useEffect, useMemo, useRef, useState } from "react";
import { COURSE_CATALOG } from "./data/courses";
import { haversineMeters, metersToYards, roundYards } from "./lib/geo";
import HoleOverlay from "./components/HoleOverlay";
import { holeImagePath } from "./data/holeImages";

const TEST_SYNC_ID = "TEST-FIXED-TEMPLATE-111";

const BUILD_TEST_ID =
  typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "DEV-NO-BUILD-ID";

const SESSION_KEY = "golfgps_lastSession_fixed_template_v2";
const FRESH_ON_NEXT_OPEN_KEY = "golfgps_freshOnNextOpen_v1";

const FIXED_IMAGE_A0 = { x: 0.5, y: 0.9236 };
const FIXED_IMAGE_C0 = { x: 0.5, y: 0.0764 };

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
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
    ...h,
  }));

  return [...front, ...back];
}

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

  const z = ACx * APy - ACy * APx;
  const crossMeters = -z / len;

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

function styleSetupBtn(background = "white") {
  return {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #333",
    background,
    fontWeight: 900,
    fontSize: 13,
    pointerEvents: "auto",
  };
}

export default function App() {
  const [page, setPage] = useState("home");

  const clubKeysAll = Object.keys(COURSE_CATALOG);

  const [courseType, setCourseType] = useState("");
  const [clubKey, setClubKey] = useState("");

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

  const pendingRestoreRef = useRef(null);
  const didInitRestoreRef = useRef(false);

  useEffect(() => {
    if (didInitRestoreRef.current) return;
    didInitRestoreRef.current = true;

    try {
      const fresh = localStorage.getItem(FRESH_ON_NEXT_OPEN_KEY) === "1";
      if (fresh) {
        localStorage.removeItem(FRESH_ON_NEXT_OPEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        return;
      }

      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || typeof s !== "object") return;

      setCourseType(s.courseType || "");
      setClubKey(s.clubKey || "");
      setMode(s.mode || "");
      setNineA(s.nineA || "");
      setNineB(s.nineB || "");

      pendingRestoreRef.current = {
        page: s.page || "home",
        desiredDisplayHole:
          s.desiredDisplayHole != null ? parseInt(s.desiredDisplayHole, 10) : null,
      };
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setClubKey("");
    setMode("");
    setNineA("");
    setNineB("");
    setPage("home");
  }, [courseType]);

  useEffect(() => {
    setMode("");
    setNineA("");
    setNineB("");
    setPage("home");

    if (!clubKey) return;

    const nn = Object.keys(
      (COURSE_CATALOG[clubKey] && COURSE_CATALOG[clubKey].nines) || {}
    );

    if (courseType === "Executive") {
      setMode("9");
      setNineA(nn[0] || "");
      setNineB(nn[0] || "");
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

  useEffect(() => {
    const p = pendingRestoreRef.current;
    if (!p) return;
    if (!roundHoles || roundHoles.length === 0) return;

    const desired = p.desiredDisplayHole;
    if (typeof desired === "number" && isFinite(desired)) {
      const i = roundHoles.findIndex((h) => h.displayHole === desired);
      if (i >= 0) setIdx(i);
      else setIdx(0);
    }

    setPage(p.page === "play" ? "play" : "home");
    pendingRestoreRef.current = null;
  }, [roundHoles]);

  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        const desiredDisplayHole = hole?.displayHole ?? null;
        const payload = {
          page,
          courseType,
          clubKey,
          mode,
          nineA,
          nineB,
          desiredDisplayHole,
          t: Date.now(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
      } catch {
        // ignore
      }
    }, 250);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [page, courseType, clubKey, mode, nineA, nineB, hole]);

  const imgSrc =
    hole && clubKey ? holeImagePath(clubKey, hole.nine, hole.hole) : null;

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
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const prevHole = () =>
    setIdx((v) => clamp(v - 1, 0, Math.max(0, roundHoles.length - 1)));
  const nextHole = () =>
    setIdx((v) => clamp(v + 1, 0, Math.max(0, roundHoles.length - 1)));

  const teeLL = hole?.tee ?? null;
  const greenLL = hole?.green ?? null;

  const teeToGreenYards = useMemo(() => {
    if (!teeLL || !greenLL) return null;
    return roundYards(metersToYards(haversineMeters(teeLL, greenLL)));
  }, [teeLL, greenLL]);

  const liveYouToGreenYards = useMemo(() => {
    if (!greenLL || !pos) return null;
    return roundYards(metersToYards(haversineMeters(pos, greenLL)));
  }, [pos, greenLL]);

  const parValue = typeof hole?.par === "number" ? hole.par : null;
  const siValue = typeof hole?.hcp === "number" ? hole.hcp : null;

  const parText = `Par ${parValue ?? "—"}`;
  const siText = `SI ${siValue ?? "—"}`;

  const codeA0 = FIXED_IMAGE_A0;
  const codeC0 = FIXED_IMAGE_C0;

  const baselineLen = useMemo(() => {
    const d = distNorm(codeA0, codeC0);
    return d > 0.0001 ? d : null;
  }, [codeA0, codeC0]);

  const yardsPerNormUnit = useMemo(() => {
    if (typeof teeToGreenYards !== "number") return null;
    if (!baselineLen) return null;
    return teeToGreenYards / baselineLen;
  }, [teeToGreenYards, baselineLen]);

  const targetSuppressRadiusNorm = useMemo(() => {
    if (!yardsPerNormUnit || !isFinite(yardsPerNormUnit) || yardsPerNormUnit <= 0) {
      return 0;
    }
    return 30 / yardsPerNormUnit;
  }, [yardsPerNormUnit]);

  const crossCalScale = 1.6;

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
  }, [crossRawYardsSigned]);

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

  const basePointAndPerp = useMemo(() => {
    if (!teeLL || !greenLL || !pos) return null;

    const t = projectAlongTeeGreen(teeLL, greenLL, pos);
    if (typeof t !== "number") return null;

    const base = {
      x: codeA0.x + (codeC0.x - codeA0.x) * t,
      y: codeA0.y + (codeC0.y - codeA0.y) * t,
    };

    const dx = codeC0.x - codeA0.x;
    const dy = codeC0.y - codeA0.y;
    const len = Math.hypot(dx, dy);
    if (!isFinite(len) || len < 0.0001) {
      return { base, perpRight: { x: 0, y: 0 }, t };
    }

    const perpRight = { x: -dy / len, y: dx / len };
    return { base, perpRight, t };
  }, [teeLL, greenLL, pos, codeA0, codeC0]);

  const youNormRaw = useMemo(() => {
    if (!basePointAndPerp) return null;
    const { base, perpRight } = basePointAndPerp;

    if (!yardsPerNormUnit) return base;
    if (typeof crossScaledYardsSigned !== "number") return base;

    const normUnitsPerYard = 1 / yardsPerNormUnit;
    const offsetNorm = crossScaledYardsSigned * normUnitsPerYard;

    return {
      x: clamp01(base.x + perpRight.x * offsetNorm),
      y: clamp01(base.y + perpRight.y * offsetNorm),
    };
  }, [basePointAndPerp, yardsPerNormUnit, crossScaledYardsSigned]);

  const trustLevel = useMemo(() => {
    const a = pos?.accuracyMeters;
    if (a == null || !isFinite(a)) return "—";
    if (a <= 10) return "HIGH";
    if (a <= 25) return "OK";
    return "LOW";
  }, [pos?.accuracyMeters]);

  const liveCartNorm =
    youNormRaw && isFinite(youNormRaw.x) && isFinite(youNormRaw.y) ? youNormRaw : null;

  const alongFromTeeYards = useMemo(() => {
    const t = basePointAndPerp?.t;
    if (typeof t !== "number") return null;
    if (typeof teeToGreenYards !== "number") return null;
    return Math.max(0, Math.min(teeToGreenYards, t * teeToGreenYards));
  }, [basePointAndPerp, teeToGreenYards]);

  const FOOTER_H = 60;
  const TOP_BTN_TOP = 40;
  const TOP_BTN_W = 92;
  const TOP_BTN_H = 44;

  const ARROW_LEFT = 80;
  const ARROW_TOP_TARGET_GREEN = 240;
  const ARROW_TOP_CART_TARGET = 640;

  const holeNumberText =
    hole?.displayHole != null
      ? String(hole.displayHole).padStart(2, "0")
      : "—";

  const roundReady = useMemo(() => {
    if (!courseType) return false;
    if (!clubKey) return false;
    if (courseType === "Executive") return true;
    if (!mode) return false;
    if (!nineA) return false;
    if (mode === "18" && !nineB) return false;
    return true;
  }, [courseType, clubKey, mode, nineA, nineB]);

  const [setupEnabled, setSetupEnabled] = useState(false);

  function enterSetup() {
    if (setupEnabled) return;
    const pw = window.prompt("Enter setup password:");
    if (pw === "golfgps") setSetupEnabled(true);
  }

  function goPlay() {
    if (!roundReady) return;
    setIdx(0);
    setPage("play");
  }

  function goHome() {
    setPage("home");
  }

  function handleCloseAndFreshNextOpen() {
    const ok = window.confirm(
      "CLOSE?\n\nNext time you open the app it will start fresh (Home screen).\n\nPress OK to enable fresh start."
    );
    if (!ok) return;

    try {
      localStorage.setItem(FRESH_ON_NEXT_OPEN_KEY, "1");
      localStorage.removeItem(SESSION_KEY);
    } catch {}

    setSetupEnabled(false);
    setPage("home");
    setCourseType("");
    setClubKey("");
    setMode("");
    setNineA("");
    setNineB("");
    setIdx(0);

    window.alert(
      "Fresh start is armed.\nYou can exit the app now.\nNext open will be a clean Home screen."
    );
  }

  const fixAgeSec =
    lastFixMs > 0
      ? Math.max(0, Math.round((Date.now() - lastFixMs) / 1000))
      : null;

  const [planningMode, setPlanningMode] = useState(false);
  const [planningCartNorm, setPlanningCartNorm] = useState(null);
  const [targetNorm, setTargetNorm] = useState(null);
  const planningStartLivePosRef = useRef(null);

  function enterPlanning(nextTargetNorm) {
    if (!liveCartNorm) return;
    setPlanningMode(true);
    setPlanningCartNorm(liveCartNorm);
    setTargetNorm(nextTargetNorm || null);
    planningStartLivePosRef.current = pos ? { lat: pos.lat, lon: pos.lon } : null;
  }

  function cancelPlanning() {
    setPlanningMode(false);
    setPlanningCartNorm(null);
    setTargetNorm(null);
    planningStartLivePosRef.current = null;
  }

  useEffect(() => {
    if (!planningMode) return;
    if (!planningStartLivePosRef.current || !pos) return;

    const movedYards = metersToYards(
      haversineMeters(planningStartLivePosRef.current, pos)
    );

    if (movedYards >= 5) {
      cancelPlanning();
    }
  }, [planningMode, pos]);

  const targetVisible = useMemo(() => {
    if (!planningMode || !planningCartNorm || !targetNorm) return false;
    if (!targetSuppressRadiusNorm || targetSuppressRadiusNorm <= 0) return true;
    return distNorm(planningCartNorm, targetNorm) > targetSuppressRadiusNorm;
  }, [planningMode, planningCartNorm, targetNorm, targetSuppressRadiusNorm]);

  const planningCartToTargetYards = useMemo(() => {
    if (!planningMode || !planningCartNorm || !targetNorm || !yardsPerNormUnit) return null;
    if (!targetVisible) return null;
    return roundYards(distNorm(planningCartNorm, targetNorm) * yardsPerNormUnit);
  }, [planningMode, planningCartNorm, targetNorm, yardsPerNormUnit, targetVisible]);

  const targetToGreenYards = useMemo(() => {
    if (!planningMode || !targetNorm || !codeC0 || !yardsPerNormUnit) return null;
    if (!targetVisible) return null;
    return roundYards(distNorm(targetNorm, codeC0) * yardsPerNormUnit);
  }, [planningMode, targetNorm, codeC0, yardsPerNormUnit, targetVisible]);

  const planningCenterYards = useMemo(() => {
    if (!planningMode || !planningCartNorm || !codeC0 || !yardsPerNormUnit) return null;
    return roundYards(distNorm(planningCartNorm, codeC0) * yardsPerNormUnit);
  }, [planningMode, planningCartNorm, codeC0, yardsPerNormUnit]);

  const displayCenterYards =
    planningMode && planningCenterYards != null ? planningCenterYards : liveYouToGreenYards;

  const greenDepth = typeof hole?.greenDepth === "number" ? hole.greenDepth : null;

  const greenBackYards =
    typeof displayCenterYards === "number" && typeof greenDepth === "number"
      ? roundYards(displayCenterYards + greenDepth / 2)
      : null;

  const greenFrontYards =
    typeof displayCenterYards === "number" && typeof greenDepth === "number"
      ? roundYards(Math.max(0, displayCenterYards - greenDepth / 2))
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
                </>
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
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{gpsStatus}</div>
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
            {planningMode && targetVisible && (
              <>
                <ArrowYardBox
                  left={ARROW_LEFT}
                  top={ARROW_TOP_TARGET_GREEN}
                  yards={targetToGreenYards}
                />
                <ArrowYardBox
                  left={ARROW_LEFT}
                  top={ARROW_TOP_CART_TARGET}
                  yards={planningCartToTargetYards}
                />
              </>
            )}

            <div
              style={{
                position: "fixed",
                left: 10,
                top: 20,
                width: 118,
                background: "white",
                color: "black",
                border: "2px solid black",
                borderRadius: 0,
                padding: "6px 6px 8px 6px",
                textAlign: "center",
                zIndex: 10000,
                fontWeight: 900,
                boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
                lineHeight: 1.0,
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 0 }}>Back</div>
              <div style={{ fontSize: 18, marginBottom: 6 }}>
                {greenBackYards ?? "—"}
              </div>

              <div style={{ fontSize: 16, marginBottom: 0 }}>Center</div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 950,
                  marginBottom: 6,
                  lineHeight: 0.95,
                }}
              >
                {displayCenterYards ?? "—"}
              </div>

              <div style={{ fontSize: 16, marginBottom: 0 }}>Front</div>
              <div style={{ fontSize: 18 }}>{greenFrontYards ?? "—"}</div>
            </div>

            {imgSrc ? (
              <HoleOverlay
                imageSrc={imgSrc}
                resetKey={`${clubKey}-${hole?.nine}-${hole?.hole}-${hole?.displayHole}`}
                initialA0={FIXED_IMAGE_A0}
                initialC0={FIXED_IMAGE_C0}
                setupEnabled={setupEnabled}
                liveCartNorm={liveCartNorm}
                planningMode={planningMode}
                planningCartNorm={planningCartNorm}
                targetNorm={targetNorm}
                targetVisible={targetVisible}
                targetSuppressRadiusNorm={targetSuppressRadiusNorm}
                youAccuracyMeters={pos?.accuracyMeters ?? null}
                onEnterPlanning={enterPlanning}
                onPlanningCartChange={setPlanningCartNorm}
                onTargetChange={setTargetNorm}
              />
            ) : (
              <div style={{ padding: 12, color: "white" }}>No image</div>
            )}

            {setupEnabled && (
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
                  width: 220,
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
                  Build: <b>{BUILD_TEST_ID}</b>
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
                  Trust: <b>{trustLevel}</b>
                </div>

                <div>
                  A0→Green:{" "}
                  <b>{teeToGreenYards != null ? `${teeToGreenYards} yd` : "—"}</b>
                </div>

                <div style={{ marginTop: 4 }}>
                  Along:{" "}
                  <b>
                    {alongFromTeeYards != null
                      ? `${Math.round(alongFromTeeYards)} yd`
                      : "—"}
                  </b>
                </div>

                <div style={{ marginTop: 4 }}>
                  Cross: <b>{crossText}</b>
                </div>

                <div style={{ opacity: 0.85, marginTop: 2 }}>
                  Raw: <b>{crossRawText}</b>
                  <div style={{ marginTop: 2 }}>
                    Cal scale: <b>{crossCalScale.toFixed(3)}</b>
                  </div>
                </div>
              </div>
            )}

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
                fontSize: 20,
                zIndex: 10000,
                opacity: setupEnabled ? 0.8 : 1,
              }}
            >
              SETUP
            </button>

            <button
              onClick={handleCloseAndFreshNextOpen}
              style={{
                position: "fixed",
                right: 10,
                top: TOP_BTN_TOP + TOP_BTN_H + 8,
                width: TOP_BTN_W,
                height: 38,
                borderRadius: 12,
                border: "1px solid #333",
                background: "#f3f3f3",
                color: "black",
                fontWeight: 950,
                fontSize: 14,
                zIndex: 10000,
              }}
            >
              CLOSE
            </button>

            <button
              onClick={goHome}
              style={{
                position: "fixed",
                right: 10,
                top: TOP_BTN_TOP + TOP_BTN_H + 8 + 46,
                width: TOP_BTN_W,
                height: 38,
                borderRadius: 12,
                border: "1px solid #333",
                background: "white",
                color: "black",
                fontWeight: 900,
                fontSize: 16,
                zIndex: 10000,
              }}
            >
              HOME
            </button>

            {planningMode && (
              <button
                onClick={cancelPlanning}
                style={{
                  position: "fixed",
                  right: 10,
                  top: TOP_BTN_TOP + TOP_BTN_H + 8 + 46 + 46,
                  width: TOP_BTN_W,
                  height: 38,
                  borderRadius: 12,
                  border: "1px solid #333",
                  background: "#f3f3f3",
                  color: "black",
                  fontWeight: 900,
                  fontSize: 14,
                  zIndex: 10000,
                }}
              >
                CANCEL
              </button>
            )}

            {setupEnabled && (
              <div
                style={{
                  position: "fixed",
                  left: 10,
                  right: 120,
                  top: 10,
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-start",
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
                  TEMPLATE MODE
                </div>

                <button
                  onClick={() => setSetupEnabled(false)}
                  style={styleSetupBtn("#f3f3f3")}
                >
                  Exit Setup
                </button>
              </div>
            )}
          </div>

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
                  You→Green {displayCenterYards ?? "—"} yd
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
