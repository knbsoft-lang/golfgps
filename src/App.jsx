import { useEffect, useState } from "react";

export default function App() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  // Hole controls (1–18)
  const [hole, setHole] = useState(1);
  const MAX_HOLES = 18;

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

  // Build filename: hole01.png, hole02.png, ... hole18.png
  const holeStr = String(hole).padStart(2, "0");
  const holeImg = `/GolfCorses/BelleGlades/Calusa/hole${holeStr}.png`;

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
      {/* Hole image */}
      <img
        src={holeImg}
        alt={`Calusa Hole ${hole}`}
        style={{
          width: "100%",
          maxWidth: "900px",
          objectFit: "contain",
        }}
      />

      {/* Hole controls */}
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
          onClick={() => setHole((h) => Math.max(1, h - 1))}
          style={{
            padding: "10px 14px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ◀ Prev
        </button>

        <div style={{ fontSize: "18px" }}>
          Hole <b>{hole}</b> / {MAX_HOLES}
        </div>

        <button
          onClick={() => setHole((h) => Math.min(MAX_HOLES, h + 1))}
          style={{
            padding: "10px 14px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Next ▶
        </button>
      </div>

      {/* GPS readout */}
      <div style={{ padding: "10px", fontSize: "18px" }}>
        {coords ? (
          <>
            <div>Lat: {coords.lat.toFixed(6)}</div>
            <div>Lon: {coords.lon.toFixed(6)}</div>
            <div>Accuracy: ±{Math.round(coords.acc)} m</div>
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