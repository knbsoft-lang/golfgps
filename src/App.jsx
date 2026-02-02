import { useEffect, useState } from "react";

export default function App() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

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
      <img
        src="/GolfCorses/BelleGlades/Calusa/hole01.png"
        alt="Calusa Hole 1"
        style={{
          width: "100%",
          maxWidth: "900px",
          objectFit: "contain",
        }}
      />

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
