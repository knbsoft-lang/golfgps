// src/App.jsx - Option B (with cross-track left/right)
import { useEffect, useMemo, useRef, useState } from "react";
import { COURSE_CATALOG } from "./data/courses";
import { haversineMeters, metersToYards, roundYards } from "./lib/geo";
import HoleOverlay from "./components/HoleOverlay";
import { holeImagePath } from "./data/holeImages";

const TEST_SYNC_ID = "TEST-FIXED-TEMPLATE-0006";

const FIXED_IMAGE_A0 = { x: 0.5, y: 0.9236 };
const FIXED_IMAGE_C0 = { x: 0.5, y: 0.0764 };

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

function buildRound(club, mode, nineA, nineB) {
  const nines = club?.nines || {};
  const A = nines[nineA] || [];
  const B = nines[nineB] || [];
  if (!club || !nineA) return [];
  if (mode === "9") return A.map(h => ({ displayHole: h.hole, nine: nineA, ...h }));
  if (!nineB) return [];
  return [
    ...A.map(h => ({ displayHole: h.hole, nine: nineA, ...h })),
    ...B.map(h => ({ displayHole: h.hole + 9, nine: nineB, ...h })),
  ];
}

function projectAlongTeeGreen(tee, green, pos) {
  if (!tee || !green || !pos) return null;
  const toRad = d => (d * Math.PI) / 180;
  const bearing = (p1, p2) => {
    const lat1 = toRad(p1.lat), lat2 = toRad(p2.lat);
    const dLon = toRad(p2.lon - p1.lon);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return Math.atan2(y, x);
  };
  const angDiff = (a,b)=>{let d=a-b; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; return d;};
  const dTG = haversineMeters(tee, green);
  const dTP = haversineMeters(tee, pos);
  if (!isFinite(dTG) || dTG < 0.5) return 0;
  const along = dTP * Math.cos(angDiff(bearing(tee,green), bearing(tee,pos)));
  return clamp(along / dTG, 0, 1);
}

function crossTrackMetersRightPositive(tee, green, pos) {
  if (!tee || !green || !pos) return null;
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
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
  const filteredClubKeys = useMemo(()=>(
    !courseType ? [] : clubKeysAll.filter(k => (COURSE_CATALOG[k]?.courseType||"Championship")===courseType)
  ), [courseType, clubKeysAll]);

  const club = clubKey ? COURSE_CATALOG[clubKey] : null;
  const nineNames = useMemo(()=>Object.keys(club?.nines||{}), [club]);
  const [mode, setMode] = useState("");
  const [nineA, setNineA] = useState("");
  const [nineB, setNineB] = useState("");

  const roundHoles = useMemo(()=>buildRound(club, mode, nineA, nineB), [club, mode, nineA, nineB]);
  const [idx, setIdx] = useState(0);
  const hole = roundHoles[idx];

  const imgSrc = hole && clubKey ? holeImagePath(clubKey, hole.nine, hole.hole) : null;

  const [pos, setPos] = useState(null);
  useEffect(()=>{
    if (!("geolocation" in navigator)) return;
    const id = navigator.geolocation.watchPosition(p=>{
      setPos({ lat:p.coords.latitude, lon:p.coords.longitude, accuracyMeters:p.coords.accuracy });
    }, ()=>{}, { enableHighAccuracy:true, maximumAge:0, timeout:20000 });
    return ()=> navigator.geolocation.clearWatch(id);
  }, []);

  const teeLL = hole?.tee ?? null;
  const greenLL = hole?.green ?? null;

  const youToGreen = useMemo(()=>{
    if (!pos || !greenLL) return null;
    return roundYards(metersToYards(haversineMeters(pos, greenLL)));
  }, [pos, greenLL]);

  const teeToGreen = useMemo(()=>{
    if (!teeLL || !greenLL) return null;
    return roundYards(metersToYards(haversineMeters(teeLL, greenLL)));
  }, [teeLL, greenLL]);

  const crossScale = 1.6;

  const liveCartNorm = useMemo(()=>{
    if (!teeLL || !greenLL || !pos) return null;
    const t = projectAlongTeeGreen(teeLL, greenLL, pos);
    if (typeof t !== "number") return null;

    const base = {
      x: FIXED_IMAGE_A0.x + (FIXED_IMAGE_C0.x - FIXED_IMAGE_A0.x) * t,
      y: FIXED_IMAGE_A0.y + (FIXED_IMAGE_C0.y - FIXED_IMAGE_A0.y) * t,
    };

    const crossM = crossTrackMetersRightPositive(teeLL, greenLL, pos);
    if (typeof crossM !== "number" || !isFinite(crossM)) return base;

    const crossYd = metersToYards(crossM) * crossScale;

    const dx = FIXED_IMAGE_C0.x - FIXED_IMAGE_A0.x;
    const dy = FIXED_IMAGE_C0.y - FIXED_IMAGE_A0.y;
    const len = Math.hypot(dx, dy) || 1;
    const perpRight = { x: -dy/len, y: dx/len };

    const yardsPerNorm = (teeToGreen && len) ? (teeToGreen / len) : null;
    if (!yardsPerNorm) return base;

    const normOffset = crossYd / yardsPerNorm;

    return {
      x: Math.max(0, Math.min(1, base.x + perpRight.x * normOffset)),
      y: Math.max(0, Math.min(1, base.y + perpRight.y * normOffset)),
    };
  }, [teeLL, greenLL, pos, teeToGreen]);

  const prevHole = ()=> setIdx(v=>clamp(v-1,0,Math.max(0,roundHoles.length-1)));
  const nextHole = ()=> setIdx(v=>clamp(v+1,0,Math.max(0,roundHoles.length-1)));

  const FOOTER_H = 60;

  return (
    <div style={{fontFamily:"system-ui", color:"white", background:"#0b0b0b", minHeight:"100vh"}}>
      {page==="home" && (
        <div style={{padding:16, maxWidth:720}}>
          <div style={{fontSize:26, fontWeight:900, marginBottom:10}}>Golf GPS</div>

          <select value={courseType} onChange={e=>setCourseType(e.target.value)}>
            <option value="">Course Type</option>
            <option>Executive</option>
            <option>Championship</option>
          </select>

          {courseType && (
            <select value={clubKey} onChange={e=>setClubKey(e.target.value)}>
              <option value="">Course</option>
              {filteredClubKeys.map(c => <option key={c}>{c}</option>)}
            </select>
          )}

          {courseType==="Championship" && clubKey && (
            <>
              <select value={mode} onChange={e=>setMode(e.target.value)}>
                <option value="">9 or 18</option>
                <option value="9">9 holes</option>
                <option value="18">18 holes</option>
              </select>

              {mode && (
                <select value={nineA} onChange={e=>setNineA(e.target.value)}>
                  <option value="">First 9</option>
                  {nineNames.map(n => <option key={n}>{n}</option>)}
                </select>
              )}

              {mode==="18" && nineA && (
                <select value={nineB} onChange={e=>setNineB(e.target.value)}>
                  <option value="">Second 9</option>
                  {nineNames.filter(n=>n!==nineA).map(n => <option key={n}>{n}</option>)}
                </select>
              )}
            </>
          )}

          <button
            onClick={()=>{ if (roundHoles.length) setPage("play"); }}
            style={{marginTop:10}}
          >PLAY</button>
        </div>
      )}

      {page==="play" && (
        <>
          <div style={{position:"fixed", left:0, right:0, top:0, bottom:FOOTER_H}}>
            {imgSrc && (
              <HoleOverlay
                imageSrc={imgSrc}
                resetKey={`${clubKey}-${hole?.nine}-${hole?.hole}-${hole?.displayHole}`}
                initialA0={FIXED_IMAGE_A0}
                initialC0={FIXED_IMAGE_C0}
                liveCartNorm={liveCartNorm}
                planningMode={false}
                planningCartNorm={null}
                targetNorm={null}
                targetVisible={false}
                targetSuppressRadiusNorm={0}
              />
            )}
          </div>

          <div style={{
            position:"fixed", bottom:0, left:0, right:0, height:FOOTER_H,
            background:"white", color:"black", display:"flex", alignItems:"center",
            justifyContent:"space-between", padding:10
          }}>
            <button onClick={prevHole}>{"<"}</button>

            <div style={{fontWeight:900}}>
              You→Green {youToGreen ?? "—"} yd
            </div>

            <button onClick={nextHole}>{">"}</button>
          </div>
        </>
      )}
    </div>
  );
}
