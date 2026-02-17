// src/components/HoleOverlay.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { clamp01, getHoleDefaults, setHoleDefaults } from "../data/holeDefaults";

const DEFAULT_A = { x: 0.5, y: 0.75 };
const DEFAULT_C = { x: 0.5, y: 0.25 };

const BLOCK_B_NEAR_ENDPOINT_PX = 35;

// Double-tap timing (ms)
const DOUBLE_TAP_MS = 350;

// Finger hit areas (bigger than visible markers)
const HIT_A = 46;
const HIT_B = 54;
const HIT_C = 46;

function normPoint(p, fallback) {
  if (!p || typeof p.x !== "number" || typeof p.y !== "number") return fallback;
  return { x: clamp01(p.x), y: clamp01(p.y) };
}

function pxFromNorm(norm, rect) {
  return { x: norm.x * rect.width, y: norm.y * rect.height };
}

function distPx(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.hypot(dx, dy);
}

function closestPointOnSegment(P, A, B) {
  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const APx = P.x - A.x;
  const APy = P.y - A.y;

  const ab2 = ABx * ABx + ABy * ABy;
  if (ab2 === 0) return { x: A.x, y: A.y };

  let t = (APx * ABx + APy * ABy) / ab2;
  t = Math.max(0, Math.min(1, t));

  return { x: A.x + t * ABx, y: A.y + t * ABy };
}

export default function HoleOverlay({
  imageSrc,
  resetKey,
  holeKey,
  initialA,
  initialC,

  setupEnabled = false,
  allowPlayB = true,

  onStateChange,
  onActionsReady,
}) {
  const containerRef = useRef(null);
  const [rect, setRect] = useState(null);

  // Double-tap detection on B
  const lastBTapMsRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setRect({ width: r.width, height: r.height });
    });

    ro.observe(el);
    const r0 = el.getBoundingClientRect();
    setRect({ width: r0.width, height: r0.height });

    return () => ro.disconnect();
  }, []);

  const fallbackA = useMemo(() => normPoint(initialA, DEFAULT_A), []);
  const fallbackC = useMemo(() => normPoint(initialC, DEFAULT_C), []);

  const [A, setA] = useState(fallbackA);
  const [C, setC] = useState(fallbackC);

  const [Bpos, setBpos] = useState({
    x: clamp01((fallbackA.x + fallbackC.x) / 2),
    y: clamp01((fallbackA.y + fallbackC.y) / 2),
  });
  const [Bactive, setBactive] = useState(false);

  const [dragging, setDragging] = useState(null);

  // Load defaults on hole change (includes B)
  useEffect(() => {
    const saved = holeKey ? getHoleDefaults(holeKey) : null;

    const nextA = saved?.A ? normPoint(saved.A, fallbackA) : fallbackA;
    const nextC = saved?.C ? normPoint(saved.C, fallbackC) : fallbackC;

    setA(nextA);
    setC(nextC);

    const mid = {
      x: clamp01((nextA.x + nextC.x) / 2),
      y: clamp01((nextA.y + nextC.y) / 2),
    };

    const nextB = saved?.B ? normPoint(saved.B, mid) : mid;
    setBpos(nextB);

    setBactive(!!saved?.Bactive);
    setDragging(null);

    lastBTapMsRef.current = 0;
  }, [resetKey, holeKey, fallbackA, fallbackC]);

  function getState() {
    return { holeKey, A, C, B: Bpos, Bactive };
  }

  function clearTarget() {
    setBactive(false);
  }

  function saveDefaults() {
    if (!holeKey) return;
    setHoleDefaults(holeKey, { A, C, B: Bpos, Bactive });
  }

  useEffect(() => {
    if (!onActionsReady) return;
    onActionsReady({
      saveDefaults,
      clearTarget,
      getState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onActionsReady, holeKey, A, C, Bpos, Bactive]);

  useEffect(() => {
    if (!onStateChange) return;
    onStateChange(getState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holeKey, A, C, Bpos, Bactive]);

  function endDrag() {
    setDragging(null);
  }

  // A and C draggable always
  // B draggable in setup OR play (if allowPlayB)
  function canDrag(which) {
    if (which === "A" || which === "C") return true;
    if (which === "B") return setupEnabled || allowPlayB;
    return false;
  }

  function onPointerDown(which, e) {
    e.preventDefault();
    e.stopPropagation();

    if (!canDrag(which)) return;

    if (which === "B") {
      if (!Bactive) return;

      // DOUBLE TAP ON B => CLEAR TARGET
      const now = Date.now();
      if (now - lastBTapMsRef.current <= DOUBLE_TAP_MS) {
        lastBTapMsRef.current = 0;
        clearTarget();
        setDragging(null);
        return;
      }
      lastBTapMsRef.current = now;
    }

    setDragging(which);
  }

  function getNormFromPointer(e) {
    if (!rect) return null;
    const bounds = containerRef.current.getBoundingClientRect();
    const px = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
    return {
      x: clamp01(px.x / rect.width),
      y: clamp01(px.y / rect.height),
      px,
    };
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const p = getNormFromPointer(e);
    if (!p) return;

    if (dragging === "A") {
      setA({ x: p.x, y: p.y });
      return;
    }

    if (dragging === "C") {
      setC({ x: p.x, y: p.y });
      return;
    }

    if (dragging === "B") {
      if (!Bactive) return;
      if (!canDrag("B")) return;
      setBpos({ x: p.x, y: p.y });
    }
  }

  function onLinePointerDown(e) {
    if (!setupEnabled && !allowPlayB) return;

    e.preventDefault();
    e.stopPropagation();

    const p = getNormFromPointer(e);
    if (!p || !rect) return;

    const Apx = pxFromNorm(A, rect);
    const Cpx = pxFromNorm(C, rect);

    // Don't allow B too close to endpoints
    if (
      distPx(p.px, Apx) < BLOCK_B_NEAR_ENDPOINT_PX ||
      distPx(p.px, Cpx) < BLOCK_B_NEAR_ENDPOINT_PX
    ) {
      return;
    }

    const cp = closestPointOnSegment(p.px, Apx, Cpx);
    setBpos({ x: clamp01(cp.x / rect.width), y: clamp01(cp.y / rect.height) });
    setBactive(true);
  }

  const Apx = rect ? pxFromNorm(A, rect) : { x: 0, y: 0 };
  const Cpx = rect ? pxFromNorm(C, rect) : { x: 0, y: 0 };
  const Bpx = rect ? pxFromNorm(Bpos, rect) : { x: 0, y: 0 };

  const lineClickable = setupEnabled || allowPlayB;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        touchAction: "none",
        userSelect: "none",
      }}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <img
        src={imageSrc}
        alt="Hole"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          pointerEvents: "none",
        }}
        draggable={false}
      />

      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        {!Bactive ? (
          <>
            <line x1={Apx.x} y1={Apx.y} x2={Cpx.x} y2={Cpx.y} stroke="lime" strokeWidth="3" />
            <line
              x1={Apx.x}
              y1={Apx.y}
              x2={Cpx.x}
              y2={Cpx.y}
              stroke="rgba(0,0,0,0)"
              strokeWidth="26"
              style={{ pointerEvents: lineClickable ? "stroke" : "none" }}
              onPointerDown={onLinePointerDown}
            />
          </>
        ) : (
          <>
            <line x1={Apx.x} y1={Apx.y} x2={Bpx.x} y2={Bpx.y} stroke="lime" strokeWidth="3" />
            <line x1={Bpx.x} y1={Bpx.y} x2={Cpx.x} y2={Cpx.y} stroke="lime" strokeWidth="3" />
          </>
        )}
      </svg>

      {/* A */}
      <Marker
        kind="A"
        norm={A}
        onDown={(e) => onPointerDown("A", e)}
        pointerEnabled={true}
        cursor={"grab"}
        hitSize={HIT_A}
      />

      {/* B only when active */}
      {Bactive && (
        <Marker
          kind="B"
          norm={Bpos}
          onDown={(e) => onPointerDown("B", e)}
          pointerEnabled={setupEnabled || allowPlayB}
          cursor={setupEnabled || allowPlayB ? "grab" : "default"}
          hitSize={HIT_B}
        />
      )}

      {/* C */}
      <Marker
        kind="C"
        norm={C}
        onDown={(e) => onPointerDown("C", e)}
        pointerEnabled={true}
        cursor={"grab"}
        hitSize={HIT_C}
      />
    </div>
  );
}

function Marker({ kind, norm, onDown, pointerEnabled, cursor, hitSize }) {
  const hs = typeof hitSize === "number" ? hitSize : 44;

  const visibleSize =
    kind === "A" ? 30 : kind === "B" ? 30 : 18;
  const dotSize = kind === "C" ? 5 : 6;

  const borderRadius = kind === "A" ? 6 : 999;

  return (
    <div
      style={{
        position: "absolute",
        left: `${norm.x * 100}%`,
        top: `${norm.y * 100}%`,
        transform: "translate(-50%, -50%)",
        width: hs,
        height: hs,
        borderRadius: "50%",
        cursor,
        pointerEvents: pointerEnabled ? "auto" : "none",
        background: "transparent",
        zIndex: 5,
      }}
      onPointerDown={pointerEnabled ? onDown : undefined}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: visibleSize,
          height: visibleSize,
          borderRadius,
          border: "2px solid white",
          background: "transparent",
          boxSizing: "border-box",
          pointerEvents: "none",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          background: "white",
          pointerEvents: "none",
          opacity: 0.95,
        }}
      />
    </div>
  );
}
