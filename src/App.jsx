// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { COURSE_CATALOG } from "./data/courses";
import {
  haversineMeters,
  metersToYards,
  pointAlongGreatCircle,
  roundYards,
} from "./lib/geo";
import HoleOverlay from "./components/HoleOverlay";
import { holeImagePath } from "./data/holeImages";
import { getHoleDefaults } from "./data/holeDefaults";

const AUTO_HIDE_WITHIN_GREEN_YARDS = 150;
const AUTO_HIDE_WITHIN_TARGET_YARDS = 100;

const HOLE_ASPECT_W = 9;
const HOLE_ASPECT_H = 16;

const TEE_BOXES = ["Black", "Gold", "Blue", "White", "Green", "Red", "Friendly"];

function defaultParForHole(holeNumber) {
  const cycle = [4, 3, 5];
  const idx = Math.max(0, (holeNumber || 1) - 1) % cycle.length;
  return cycle[idx];
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function projectT(A, C, B) {
  const vx = C.x - A.x;
  const vy = C.y - A.y;
  const wx = B.x - A.x;
  const wy = B.y - A.y;
  const vv = vx * vx + vy * vy;
  if (vv === 0) return 0;
  let t = (wx * vx + wy * vy) / vv;
  t = Math.max(0, Math.min(1, t));
  return t;
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
  }));

  return [...front, ...back];
}

function ArrowYardBox({ top, yards }) {
  const W = 45;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: W,
        padding: "4px 5px",
        background: "rgba(255,255,255,0.95)",
        color: "#000",
        border: "1px solid #000",
        borderRadius: "0 8px 8px 0",
        boxShadow: "0 3px 10px rgba(0,0,0,0.22)",
        pointerEvents: "none",
        zIndex: 6,
        clipPath:
          "polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.0 }}>
          {typeof yards === "number" ? yards : "—"}
        </div>
        <div style={{ fontSize: 9, fontWeight: 900, opacity: 0.9 }}>yd</div>
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
  }, [courseType]);

  useEffect(() => {
    setMode("");
    setNineA("");
    setNineB("");
    setTeeBox("");

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

  const imgSrc =
    hole && clubKey ? holeImagePath(clubKey, hole.nine, hole.hole) : null;

  const holeKey =
    hole && clubKey
      ? `${clubKey.replace(/\s+/g, "")}-${hole.nine}-${String(hole.hole).padStart(
          2,
          "0"
        )}`
      : "";

  // GPS
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

  // Yardages
  const teeToGreenYards = useMemo(() => {
    if (!hole) return null;
    return roundYards(metersToYards(haversineMeters(hole.tee, hole.green)));
  }, [hole]);

  const youToGreenYards = useMemo(() => {
    if (!hole || !pos) return null;
    return roundYards(metersToYards(haversineMeters(pos, hole.green)));
  }, [hole, pos]);

  // Par
  const parValue =
    typeof hole?.par === "number"
      ? hole.par
      : defaultParForHole(hole?.displayHole || hole?.hole || 1);

  const parText = `Par ${parValue}`;

  // Auto-hide B
  const [bHidden, setBHidden] = useState(false);
  useEffect(() => setBHidden(false), [holeKey]);

  // Live overlay state + actions
  const [liveOverlay, setLiveOverlay] = useState(null);
  useEffect(() => setLiveOverlay(null), [holeKey]);

  const overlayActionsRef = useRef(null);

  // Setup Mode
  const [setupEnabled, setSetupEnabled] = useState(false);

  // A/C/B source for yardages (live first, then saved)
  const acbSource = useMemo(() => {
    if (liveOverlay?.holeKey === holeKey && liveOverlay?.Bactive) {
      return {
        A: liveOverlay.A,
        C: liveOverlay.C,
        B: liveOverlay.B,
        Bactive: true,
      };
    }
    const saved = holeKey ? getHoleDefaults(holeKey) : null;
    if (saved?.Bactive && saved?.A && saved?.C && saved?.B) {
      return { A: saved.A, C: saved.C, B: saved.B, Bactive: true };
    }
    return null;
  }, [liveOverlay, holeKey]);

  const bGeoInfo = useMemo(() => {
    if (!holeKey || !hole) return null;
    if (!acbSource?.Bactive) return null;

    const t = projectT(acbSource.A, acbSource.C, acbSource.B);

    const teeToGreenMeters = haversineMeters(hole.tee, hole.green);
    const bMetersFromTee = teeToGreenMeters * t;

    const bGeo = pointAlongGreatCircle(hole.tee, hole.green, bMetersFromTee);
    const bToGreenYards = roundYards(
      metersToYards(haversineMeters(bGeo, hole.green))
    );

    return { t, bGeo, bToGreenYards, bMetersFromTee };
  }, [holeKey, hole, acbSource]);

  const teeToTargetYards = useMemo(() => {
    if (!bGeoInfo) return null;
    return roundYards(metersToYards(bGeoInfo.bMetersFromTee));
  }, [bGeoInfo]);

  const targetToGreenYards = useMemo(() => {
    if (!bGeoInfo?.bGeo || !hole?.green) return null;
    return roundYards(metersToYards(haversineMeters(bGeoInfo.bGeo, hole.green)));
  }, [bGeoInfo, hole]);

  const showTargetBoxes = useMemo(() => {
    return !bHidden && typeof teeToTargetYards === "number";
  }, [bHidden, teeToTargetYards]);

  useEffect(() => {
    if (!hole || !pos) return;
    if (bHidden) return;

    if (
      typeof youToGreenYards === "number" &&
      youToGreenYards <= AUTO_HIDE_WITHIN_GREEN_YARDS
    ) {
      setBHidden(true);
      return;
    }

    if (
      typeof teeToTargetYards === "number" &&
      teeToTargetYards <= AUTO_HIDE_WITHIN_TARGET_YARDS
    ) {
      setBHidden(true);
      return;
    }

    if (bGeoInfo && typeof youToGreenYards === "number") {
      if (youToGreenYards < bGeoInfo.bToGreenYards) setBHidden(true);
    }
  }, [hole, pos, youToGreenYards, teeToTargetYards, bGeoInfo, bHidden]);

  const FOOTER_H = 60;
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

  return (
    <div
      style={{
        fontFamily: "system-ui",
        color: "white",
        background: "#0b0b0b",
        minHeight: "100vh",
        paddingBottom: FOOTER_H + 24,
      }}
    >
      {/* moved padding tighter */}
      <div style={{ display: "flex", gap: 16, padding: "8px 16px 16px 16px" }}>
        {/* LEFT COLUMN */}
        <div style={{ width: 188, flex: "0 0 188px" }}>
          {/* TITLE moved here and moved up */}
          <div style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px 0" }}>
            Golf GPS
          </div>

          <div style={{ fontWeight: 900, marginBottom: 8, opacity: 0.9 }}>
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
          </div>

          {/* Yardages under selections */}
          <div
            style={{
              marginTop: 12,
              padding: 10,
              border: "1px solid #222",
              borderRadius: 12,
              background: "#101010",
              lineHeight: 1.5,
              fontSize: 13,
              opacity: 0.95,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>{gpsStatus}</div>
            <div>
              You → Green: <strong>{youToGreenYards ?? "—"} yd</strong>
            </div>
            <div>
              Tee → Green: <strong>{teeToGreenYards ?? "—"} yd</strong>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!roundReady ? (
            <div
              style={{
                marginTop: 6,
                padding: 14,
                border: "1px solid #222",
                borderRadius: 12,
                background: "#101010",
                lineHeight: 1.5,
                maxWidth: 720,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 6 }}>
                Make selections on the left to start.
              </div>
              <div style={{ opacity: 0.85 }}>
                You’ll see the hole image once your required dropdowns are chosen.
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  marginTop: 6,
                  height: "calc(65vh + 200px)",
                  border: "1px solid #222",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    aspectRatio: `${HOLE_ASPECT_W} / ${HOLE_ASPECT_H}`,
                    maxWidth: "100%",
                  }}
                >
                  {showTargetBoxes && (
                    <ArrowYardBox top={180} yards={targetToGreenYards} />
                  )}
                  {showTargetBoxes && (
                    <ArrowYardBox top={450} yards={teeToTargetYards} />
                  )}

                  {imgSrc ? (
                    bHidden ? (
                      <img
                        src={imgSrc}
                        alt="Hole"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                        draggable={false}
                      />
                    ) : (
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
                    )
                  ) : (
                    <div style={{ padding: 12, color: "white" }}>
                      No image (check file path/name)
                    </div>
                  )}
                </div>
              </div>

              {setupEnabled && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => overlayActionsRef.current?.saveDefaults?.()}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #333",
                      background: "white",
                      fontWeight: 900,
                    }}
                  >
                    Save Defaults
                  </button>

                  <button
                    onClick={() => overlayActionsRef.current?.clearTarget?.()}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #333",
                      background: "white",
                      fontWeight: 900,
                    }}
                  >
                    Clear Target
                  </button>

                  <button
                    onClick={() => setSetupEnabled(false)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #333",
                      background: "#f3f3f3",
                      fontWeight: 900,
                    }}
                  >
                    Exit Setup
                  </button>
                </div>
              )}

              <div style={{ marginTop: 8, opacity: 0.75, fontSize: 12 }}>
                {!setupEnabled ? (
                  <>
                    Tap the green line to set a target. Drag to change location.
                    Double Tap to clear it.
                  </>
                ) : (
                  <>
                    Setup mode: drag A/C, tap the line to set B, then Save Defaults.
                    (B also supports double-tap to clear.)
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom-left button/badge zone */}
      {!setupEnabled ? (
        <button
          onClick={enterSetup}
          style={{
            position: "fixed",
            left: 10,
            bottom: FOOTER_H + 10,
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "white",
            color: "black",
            fontWeight: 900,
            zIndex: 9999,
          }}
        >
          Setup
        </button>
      ) : (
        <div
          style={{
            position: "fixed",
            left: 10,
            bottom: FOOTER_H + 10,
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #1b1b1b",
            background: "rgba(0,0,0,0.65)",
            color: "white",
            fontWeight: 900,
            letterSpacing: 0.5,
            zIndex: 9999,
          }}
        >
          SETUP MODE
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
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
            minWidth: 220,
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 1 }}>
            {holeNumberText}
          </div>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <div style={{ fontSize: 14, fontWeight: 900, opacity: 0.95 }}>
              YTG {teeToGreenYards ?? "—"} yd
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, opacity: 0.95 }}>
              {parText}
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
    </div>
  );
}
