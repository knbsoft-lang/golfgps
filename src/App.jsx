// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { COURSE_CATALOG } from "./data/courses";
import { haversineMeters, metersToYards, roundYards } from "./lib/geo";
import HoleOverlay from "./components/HoleOverlay";
import { holeImagePath } from "./data/holeImages";
import { getHoleDefaults } from "./data/holeDefaults";

const TEE_BOXES = ["Black", "Gold", "Blue", "White", "Green", "Red", "Friendly"];

function defaultParForHole(holeNumber) {
  const cycle = [4, 3, 5];
  const idx = Math.max(0, (holeNumber || 1) - 1) % cycle.length;
  return cycle[idx];
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// Distance in normalized overlay units (0..1)
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

// HIGH-CONTRAST arrow yard box
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

        // Halo outline for busy backgrounds (houses/trees)
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

export default function App() {
  const [page, setPage] = useState("home"); // "home" | "play"

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
  useEffect(() => setStartHoleDisplay("1"), [courseType, clubKey, mode, nineA, nineB]);

  const imgSrc =
    hole && clubKey ? holeImagePath(clubKey, hole.nine, hole.hole) : null;

  // IMPORTANT: keep this template literal on ONE LINE (prevents paste issues)
  const holeKey =
    hole && clubKey
      ? `${clubKey.replace(/\s+/g, "")}-${hole.nine}-${String(hole.hole).padStart(2, "0")}`
      : "";

  // ========= GPS =========
  const [pos, setPos] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("GPS not started");
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGpsStatus("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
          accuracyMeters: p.coords.accuracy,
        });
        setGpsStatus("GPS locked");
      },
      (err) => setGpsStatus(`GPS error: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const prevHole = () =>
    setIdx((v) => clamp(v - 1, 0, Math.max(0, roundHoles.length - 1)));
  const nextHole = () =>
    setIdx((v) => clamp(v + 1, 0, Math.max(0, roundHoles.length - 1)));

  // Straight-line tee->green
  const teeToGreenYards = useMemo(() => {
    if (!hole) return null;
    return roundYards(metersToYards(haversineMeters(hole.tee, hole.green)));
  }, [hole]);

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

  // Setup Mode
  const [setupEnabled, setSetupEnabled] = useState(false);

  // ========= BASELINE (FROZEN) SCALE PER HOLE =========
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

  const showTargetBoxes = useMemo(() => {
    return Bactive && typeof teeToTargetYards === "number";
  }, [Bactive, teeToTargetYards]);

  const showGreenOnlyBox = useMemo(() => {
    return !Bactive;
  }, [Bactive]);

  // Layout constants
  const FOOTER_H = 60;

  // Top buttons
  const TOP_BTN_TOP = 40;
  const TOP_BTN_W = 92;
  const TOP_BTN_H = 44;

  // Arrow boxes position (YOU WANTED 80)
  const ARROW_LEFT = 80;
  const ARROW_TOP_BC = 240;
  const ARROW_TOP_AB = 540;
  const ARROW_TOP_AC = 260;

  const holeNumberText =
    hole?.displayHole != null ? String(hole.displayHole).padStart(2, "0") : "—";

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

  return (
    <div
      style={{
        fontFamily: "system-ui",
        color: "white",
        background: "#0b0b0b",
        minHeight: "100vh",
      }}
    >
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
                    label: `Start Hole ${String(h.displayHole).padStart(2, "0")} (${h.nine})`,
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
            {showGreenOnlyBox && (
              <ArrowYardBox
                left={ARROW_LEFT}
                top={ARROW_TOP_AC}
                yards={typeof modeledTotalYards === "number" ? modeledTotalYards : teeToGreenYards}
              />
            )}
            {showTargetBoxes && (
              <ArrowYardBox left={ARROW_LEFT} top={ARROW_TOP_BC} yards={targetToGreenYards} />
            )}
            {showTargetBoxes && (
              <ArrowYardBox left={ARROW_LEFT} top={ARROW_TOP_AB} yards={teeToTargetYards} />
            )}

            {/* Overlay */}
            {imgSrc ? (
              <HoleOverlay
                imageSrc={imgSrc}
                resetKey={`${clubKey}-${hole?.nine}-${hole?.hole}-${hole?.displayHole}`}
                holeKey={holeKey}
                setupEnabled={setupEnabled}
                allowPlayB={true}
                onStateChange={(state) => setLiveOverlay(state)}
                onActionsReady={(actions) => {
                  overlayActionsRef.current = actions;
                }}
              />
            ) : (
              <div style={{ padding: 12, color: "white" }}>No image</div>
            )}

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

            {/* Setup controls */}
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

              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
                <div style={{ fontSize: 17, fontWeight: 900, opacity: 0.95 }}>
                  {teeToGreenYards ?? "—"} yd
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
