// src/App.jsx — OPTION B (CORRECT VERSION based on your working build)

import { useEffect, useMemo, useState } from "react";
import { COURSE_CATALOG } from "./data/courses";
import { haversineMeters, metersToYards, roundYards } from "./lib/geo";
import HoleOverlay from "./components/HoleOverlay";
import { holeImagePath } from "./data/holeImages";

const TEST_SYNC_ID = "TEST-FIXED-TEMPLATE-0005";

const FIXED_IMAGE_A0 = { x: 0.5, y: 0.9236 };
const FIXED_IMAGE_C0 = { x: 0.5, y: 0.0764 };

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function buildRound(club, mode, nineA, nineB) {
  const nines = club?.nines || {};
  const A = nines[nineA] || [];
  const B = nines[nineB] || [];

  if (!club || !nineA) return [];

  if (mode === "9") {
    return A.map((h) => ({
      displayHole: h.hole,
      nine: nineA,
      ...h,
    }));
  }

  if (!nineB) return [];

  return [
    ...A.map((h) => ({ displayHole: h.hole, nine: nineA, ...h })),
    ...B.map((h) => ({ displayHole: h.hole + 9, nine: nineB, ...h })),
  ];
}

// ===== ALONG TRACK =====
function projectAlongTeeGreen(tee, green, pos) {
  if (!tee || !green || !pos) return null;

  const toRad = (d) => (d * Math.PI) / 180;

  const bearing = (p1, p2) => {
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
  const dTP = haversineMeters(tee, pos);

  if (!isFinite(dTG) || dTG < 0.5) return 0;

  const along = dTP * Math.cos(angleDiff(bearing(tee, green), bearing(tee, pos)));

  return clamp(along / dTG, 0, 1);
}

// ===== CROSS TRACK (OPTION B) =====
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

  return -z / len;
}

export default function App() {
  const [page, setPage] = useState("home");

  const clubKeysAll = Object.keys(COURSE_CATALOG);
  const [courseType, setCourseType] = useState("");
  const [clubKey, setClubKey] = useState("");

  const filteredClubKeys = useMemo(() => {
    if (!courseType) return [];
    return clubKeysAll.filter(
      (k) =>
        (COURSE_CATALOG[k]?.courseType || "Championship") === courseType
    );
  }, [courseType, clubKeysAll]);

  const club = clubKey ? COURSE_CATALOG[clubKey] : null;
  const nineNames = useMemo(() => Object.keys(club?.nines || {}), [club]);

  const [mode, setMode] = useState("");
  const [nineA, setNineA] = useState("");
  const [nineB, setNineB] = useState("");

  const roundHoles = useMemo(
    () => buildRound(club, mode, nineA, nineB),
    [club, mode, nineA, nineB]
  );

  const [idx, setIdx] = useState(0);
  const hole = roundHoles[idx];

  const imgSrc =
    hole && clubKey ? holeImagePath(clubKey, hole.nine, hole.hole) : null;

  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const teeLL = hole?.tee ?? null;
  const greenLL = hole?.green ?? null;

  const teeToGreenYards = useMemo(() => {
    if (!teeLL || !greenLL) return null;
    return roundYards(metersToYards(haversineMeters(teeLL, greenLL)));
  }, [teeLL, greenLL]);

  const liveCartNorm = useMemo(() => {
    if (!teeLL || !greenLL || !pos) return null;

    const t = projectAlongTeeGreen(teeLL, greenLL, pos);

    const base = {
      x: FIXED_IMAGE_A0.x + (FIXED_IMAGE_C0.x - FIXED_IMAGE_A0.x) * t,
      y: FIXED_IMAGE_A0.y + (FIXED_IMAGE_C0.y - FIXED_IMAGE_A0.y) * t,
    };

    const crossM = crossTrackMetersRightPositive(teeLL, greenLL, pos);
    if (typeof crossM !== "number") return base;

    const crossScale = 1.6;
    const crossYd = metersToYards(crossM) * crossScale;

    const dx = FIXED_IMAGE_C0.x - FIXED_IMAGE_A0.x;
    const dy = FIXED_IMAGE_C0.y - FIXED_IMAGE_A0.y;
    const len = Math.hypot(dx, dy) || 1;

    const perpRight = { x: -dy / len, y: dx / len };

    const yardsPerNorm =
      teeToGreenYards && len ? teeToGreenYards / len : null;

    if (!yardsPerNorm) return base;

    const normOffset = crossYd / yardsPerNorm;

    return {
      x: Math.max(0, Math.min(1, base.x + perpRight.x * normOffset)),
      y: Math.max(0, Math.min(1, base.y + perpRight.y * normOffset)),
    };
  }, [teeLL, greenLL, pos, teeToGreenYards]);

  const FOOTER_H = 60;

  return (
    <div style={{ fontFamily: "system-ui", background: "#0b0b0b", minHeight: "100vh" }}>
      {page === "home" && (
        <div style={{ padding: 16 }}>
          <h2 style={{ color: "white" }}>Golf GPS</h2>

          <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
            <option value="">Course Type</option>
            <option>Executive</option>
            <option>Championship</option>
          </select>

          {courseType && (
            <select value={clubKey} onChange={(e) => setClubKey(e.target.value)}>
              <option value="">Course</option>
              {filteredClubKeys.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}

          <button onClick={() => setPage("play")}>PLAY</button>
        </div>
      )}

      {page === "play" && (
        <>
          <div style={{ position: "fixed", top: 0, bottom: FOOTER_H, left: 0, right: 0 }}>
            {imgSrc && (
              <HoleOverlay
                imageSrc={imgSrc}
                initialA0={FIXED_IMAGE_A0}
                initialC0={FIXED_IMAGE_C0}
                liveCartNorm={liveCartNorm}
              />
            )}
          </div>

          <div
            style={{
              position: "fixed",
              bottom: 0,
              height: FOOTER_H,
              background: "white",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <button onClick={() => setIdx((v) => Math.max(0, v - 1))}>{"<"}</button>

            <div style={{ fontWeight: 900 }}>You→Green</div>

            <button onClick={() => setIdx((v) => v + 1)}>{">"}</button>
          </div>
        </>
      )}
    </div>
  );
}