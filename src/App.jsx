import { useEffect, useMemo, useState } from "react";

const COURSE_ROOT = "/GolfCorses/BelleGlades";
const NINES = ["Calusa", "Seminole", "Tequesta"];

const EIGHTEENS = [
  { label: "Calusa / Seminole", legs: ["Calusa", "Seminole"] },
  { label: "Seminole / Tequesta", legs: ["Seminole", "Tequesta"] },
  { label: "Tequesta / Calusa", legs: ["Tequesta", "Calusa"] },
];

const HOLES_PER_NINE = 9;

const POINTS = {
  Calusa: {
    1: { white: { lat: 28.844444, lon: -81.955278 }, green: { lat: 28.841111, lon: -81.954722 } },
    2: { white: { lat: 28.840278, lon: -81.953889 }, green: { lat: 28.8375, lon: -81.954167 } },
    3: { white: { lat: 28.836944, lon: -81.954444 }, green: { lat: 28.835833, lon: -81.954167 } },
    4: { white: { lat: 28.835556, lon: -81.956111 }, green: { lat: 28.833056, lon: -81.9575 } },
    5: { white: { lat: 28.831111, lon: -81.956944 }, green: { lat: 28.829167, lon: -81.955 } },
    6: { white: { lat: 28.829444, lon: -81.954444 }, green: { lat: 28.830278, lon: -81.953889 } },
    7: { white: { lat: 28.830833, lon: -81.953889 }, green: { lat: 28.833333, lon: -81.953889 } },
    8: { white: { lat: 28.836389, lon: -81.955556 }, green: { lat: 28.839722, lon: -81.956389 } },
    9: { white: { lat: 28.841111, lon: -81.956667 }, green: { lat: 28.844167, lon: -81.956667 } },
  },
  Seminole: {
    1: { white: { lat: 28.843889, lon: -81.958333 }, green: { lat: 28.841111, lon: -81.958333 } },
    2: { white: { lat: 28.84, lon: -81.958333 }, green: { lat: 28.837222, lon: -81.958333 } },
    3: { white: { lat: 28.837222, lon: -81.9575 }, green: { lat: 28.840556, lon: -81.9575 } },
    4: { white: { lat: 28.841944, lon: -81.957222 }, green: { lat: 28.844167, lon: -81.9575 } },
    5: { white: { lat: 28.8475, lon: -81.953889 }, green: { lat: 28.851111, lon: -81.953889 } },
    6: { white: { lat: 28.8525, lon: -81.955 }, green: { lat: 28.853889, lon: -81.954167 } },
    7: { white: { lat: 28.853611, lon: -81.953611 }, green: { lat: 28.852778, lon: -81.953889 } },
    8: { white: { lat: 28.850278, lon: -81.955 }, green: { lat: 28.863611, lon: -81.954722 } },
    9: { white: { lat: 28.846111, lon: -81.954444 }, green: { lat: 28.845, lon: -81.954722 } },
  },
  Tequesta: {
    1: { white: { lat: 28.844167, lon: -81.961389 }, green: { lat: 28.841389, lon: -81.960278 } },
    2: { white: { lat: 28.840556, lon: -81.960833 }, green: { lat: 28.838611, lon: -81.963056 } },
    3: { white: { lat: 28.839444, lon: -81.962778 }, green: { lat: 28.841667, lon: -81.962778 } },
    4: { white: { lat: 28.8425, lon: -81.962778 }, green: { lat: 28.841111, lon: -81.965 } },
    5: { white: { lat: 28.84, lon: -81.965278 }, green: { lat: 28.836667, lon: -81.964444 } },
    6: { white: { lat: 28.836111, lon: -81.963333 }, green: { lat: 28.836944, lon: -81.962778 } },
    7: { white: { lat: 28.836389, lon: -81.961667 }, green: { lat: 28.838333, lon: -81.959722 } },
    8: { white: { lat: 28.839167, lon: -81.959444 }, green: { lat: 28.84, lon: -81.959722 } },
    9: { white: { lat: 28.841111, lon: -81.959167 }, green: { lat: 28.843889, lon: -81.959167 } },
  },
};

function holeImagePath(nineName, holeNumber1to9) {
  const holeStr = String(holeNumber1to9).padStart(2, "0");
  return `${COURSE_ROOT}/${nineName}/hole${holeStr}.png`;
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const dφ = toRad(lat2 - lat1);
  const dλ = toRad(lon2 - lon1);
  const a =
    Math.sin(dφ / 2) * Math.sin(dφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) * Math.sin(dλ / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function App() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  // Round setup
  const [holesToPlay, setHolesToPlay] = useState(9); // 9 or 18
  const [nineChoice, setNineChoice] = useState("Calusa");
  const [eighteenChoice, setEighteenChoice] = useState(EIGHTEENS[0].label);

  // Current hole in the round (1..9 or 1..18)
  const [roundHole, setRoundHole] = useState(1);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          acc: pos.coords.accuracy,
        });
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Which 9s are in this round
  const legs = useMemo(() => {
    if (holesToPlay === 9) return [nineChoice];
    const found = EIGHTEENS.find((x) => x.label === eighteenChoice);
    return found ? found.legs : EIGHTEENS[0].legs;
  }, [holesToPlay, nineChoice, eighteenChoice]);

  const maxRoundHoles = holesToPlay === 9 ? 9 : 18;

  // Reset to hole 1 when you change round setup
  useEffect(() => {
    setRoundHole(1);
  }, [holesToPlay, nineChoice, eighteenChoice]);

  // Map roundHole -> which nine + which hole (1..9)
  const { currentNine, holeInNine, imgSrc } = useMemo(() => {
    const legIndex = holesToPlay === 9 ? 0 : roundHole <= 9 ? 0 : 1;
    const nine = legs[legIndex] || legs[0] || "Calusa";
    const holeNum = holesToPlay === 9 ? roundHole : ((roundHole - 1) % 9) + 1;

    return {
      currentNine: nine,
      holeInNine: holeNum,
      imgSrc: holeImagePath(nine, holeNum),
    };
  }, [holesToPlay, legs, roundHole]);

  // Tee/Green points for current hole
  const teeGreen = POINTS?.[currentNine]?.[holeInNine] || null;

  // Distances (yards)
  const distances = useMemo(() => {
    if (!coords || !teeGreen) return null;

    const metersToYards = 1.0936133;
    const toGreenM = haversineMeters(coords.lat, coords.lon, teeGreen.green.lat, teeGreen.green.lon);
    const toTeeM = haversineMeters(coords.lat, coords.lon, teeGreen.white.lat, teeGreen.white.lon);
    const teeToGreenM = haversineMeters(
      teeGreen.white.lat,
      teeGreen.white.lon,
      teeGreen.green.lat,
      teeGreen.green.lon
    );

    return {
      toGreenY: Math.round(toGreenM * metersToYards),
      toTeeY: Math.round(toTeeM * metersToYards),
      teeToGreenY: Math.round(teeToGreenM * metersToYards),
    };
  }, [coords, teeGreen]);

  return (
    <div
      style={{
        background: "black",
        color: "white",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Round setup */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          Holes:
          <select
            value={holesToPlay}
            onChange={(e) => setHolesToPlay(Number(e.target.value))}
            style={{ padding: "6px", fontSize: "16px" }}
          >
            <option value={9}>9</option>
            <option value={18}>18</option>
          </select>
        </label>

        {holesToPlay === 9 ? (
          <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            Nine:
            <select
              value={nineChoice}
              onChange={(e) => setNineChoice(e.target.value)}
              style={{ padding: "6px", fontSize: "16px" }}
            >
              {NINES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            18-hole combo:
            <select
              value={eighteenChoice}
              onChange={(e) => setEighteenChoice(e.target.value)}
              style={{ padding: "6px", fontSize: "16px" }}
            >
              {EIGHTEENS.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <div style={{ opacity: 0.9 }}>
          Showing: <b>{currentNine}</b> — Hole <b>{holeInNine}</b>
        </div>
      </div>

      {/* Image display - FIXED SIZE ON SCREEN */}
      {/* This makes every hole appear the same size on screen even if PNG widths differ */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "70vh", // <- fixed viewing height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
        }}
      >
        <img
          src={imgSrc}
          alt={`${currentNine} Hole ${holeInNine}`}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Prev/Next */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <button
          onClick={() => setRoundHole((h) => Math.max(1, h - 1))}
          style={{ padding: "10px 14px", fontSize: "16px", cursor: "pointer" }}
        >
          ◀ Prev
        </button>

        <div style={{ fontSize: "18px" }}>
          Round Hole <b>{roundHole}</b> / {maxRoundHoles}
        </div>

        <button
          onClick={() => setRoundHole((h) => Math.min(maxRoundHoles, h + 1))}
          style={{ padding: "10px 14px", fontSize: "16px", cursor: "pointer" }}
        >
          Next ▶
        </button>
      </div>

      {/* GPS + Distances */}
      <div style={{ padding: "10px", fontSize: "18px", width: "100%", maxWidth: "900px" }}>
        {coords ? (
          <>
            <div>Lat: {coords.lat.toFixed(6)}</div>
            <div>Lon: {coords.lon.toFixed(6)}</div>
            <div>Accuracy: ±{Math.round(coords.acc)} m</div>

            {distances ? (
              <div style={{ marginTop: "10px", fontSize: "20px" }}>
                <div>
                  Distance to <b>Green</b>: <b>{distances.toGreenY}</b> yd
                </div>
                <div style={{ opacity: 0.9 }}>
                  Distance to <b>White Tee</b>: {distances.toTeeY} yd
                </div>
                <div style={{ opacity: 0.9 }}>
                  White Tee → Green: {distances.teeToGreenY} yd
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "10px", opacity: 0.9 }}>
                Distance: (waiting for GPS or points)
              </div>
            )}
          </>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <div>Waiting for GPS…</div>
        )}
      </div>
    </div>
  );
}
