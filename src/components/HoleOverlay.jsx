// src/components/HoleOverlay.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}

function normPoint(p, fallback) {
  if (!p || typeof p.x !== "number" || typeof p.y !== "number") return fallback;
  return { x: clamp01(p.x), y: clamp01(p.y) };
}

function distPx(p1, p2) {
  const dx = (p2.x || 0) - (p1.x || 0);
  const dy = (p2.y || 0) - (p1.y || 0);
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

function computeContainBox(container, natural) {
  const cw = container?.width || 0;
  const ch = container?.height || 0;
  const iw = natural?.width || 0;
  const ih = natural?.height || 0;

  if (!cw || !ch || !iw || !ih) return null;

  const containerAspect = cw / ch;
  const imageAspect = iw / ih;

  let width;
  let height;
  let left;
  let top;

  if (imageAspect > containerAspect) {
    width = cw;
    height = cw / imageAspect;
    left = 0;
    top = (ch - height) / 2;
  } else {
    height = ch;
    width = ch * imageAspect;
    top = 0;
    left = (cw - width) / 2;
  }

  return { left, top, width, height };
}

function pxFromNormInBox(norm, box) {
  return {
    x: box.left + norm.x * box.width,
    y: box.top + norm.y * box.height,
  };
}

function ringPxFromAccuracy(accuracyMeters) {
  if (typeof accuracyMeters !== "number" || !isFinite(accuracyMeters)) return 12;
  const m = Math.max(1, Math.min(35, accuracyMeters));
  return 8 + ((m - 1) / 34) * 24;
}

const DEFAULT_A0 = { x: 0.5, y: 0.75 };
const DEFAULT_C0 = { x: 0.5, y: 0.1 };

export default function HoleOverlay({
  imageSrc,
  resetKey,
  holeKey,
  initialA0,
  initialC0,
  setupEnabled = false,
  liveCartNorm = null,
  planningMode = false,
  planningCartNorm = null,
  targetNorm = null,
  youAccuracyMeters = null,
  onUserInteract = null,
  onEnterPlanning = null,
  onPlanningCartChange = null,
  onTargetChange = null,
  onBuilderChange = null,
  onActionsReady = null,
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [containerRect, setContainerRect] = useState(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const [dragging, setDragging] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const [A0, setA0] = useState(normPoint(initialA0, DEFAULT_A0));
  const [C0, setC0] = useState(normPoint(initialC0, DEFAULT_C0));

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setContainerRect({ width: r.width, height: r.height });
    });

    ro.observe(el);
    const r0 = el.getBoundingClientRect();
    setContainerRect({ width: r0.width, height: r0.height });

    return () => ro.disconnect();
  }, []);

  function handleImgLoad() {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({
      width: img.naturalWidth || 0,
      height: img.naturalHeight || 0,
    });
  }

  const imageBox = useMemo(
    () => computeContainBox(containerRect, naturalSize),
    [containerRect, naturalSize]
  );

  useEffect(() => {
    setA0(normPoint(initialA0, DEFAULT_A0));
    setC0(normPoint(initialC0, DEFAULT_C0));
    setDragging(null);
    dragOffsetRef.current = { x: 0, y: 0 };
  }, [resetKey, initialA0, initialC0]);

  useEffect(() => {
    if (!onBuilderChange) return;
    onBuilderChange({ holeKey, A0, C0 });
  }, [holeKey, A0, C0, onBuilderChange]);

  function getState() {
    return { holeKey, A0, C0 };
  }

  function getOverlayOnly() {
    return {
      A0: { x: +A0.x.toFixed(4), y: +A0.y.toFixed(4) },
      C0: { x: +C0.x.toFixed(4), y: +C0.y.toFixed(4) },
    };
  }

  function copyOverlayJson() {
    const payload = getOverlayOnly();
    const text = JSON.stringify(payload, null, 2);

    try {
      navigator.clipboard.writeText(text);
      window.alert(`A0/C0 copied for ${holeKey || "hole"}:\n\n${text}`);
    } catch {
      window.prompt("Copy this A0/C0 JSON:", text);
    }
  }

  useEffect(() => {
    if (!onActionsReady) return;
    onActionsReady({
      getState,
      getOverlayOnly,
      copyOverlayJson,
    });
  }, [onActionsReady, holeKey, A0, C0]);

  function endDrag() {
    setDragging(null);
    dragOffsetRef.current = { x: 0, y: 0 };
  }

  function getNormFromPointer(e) {
    if (!containerRef.current || !imageBox) return null;

    const bounds = containerRef.current.getBoundingClientRect();
    const px = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };

    return {
      x: clamp01((px.x - imageBox.left) / imageBox.width),
      y: clamp01((px.y - imageBox.top) / imageBox.height),
      px,
    };
  }

  function onPointerDown(which, e) {
    e.preventDefault();
    e.stopPropagation();

    if (onUserInteract) onUserInteract();

    const p = getNormFromPointer(e);
    if (!p) return;

    let center = null;

    if (which === "A0" && setupEnabled) center = A0;
    if (which === "C0" && setupEnabled) center = C0;
    if (which === "planningCart" && planningMode && planningCartNorm) center = planningCartNorm;
    if (which === "target" && planningMode && targetNorm) center = targetNorm;

    if (!center) return;

    dragOffsetRef.current = {
      x: p.x - center.x,
      y: p.y - center.y,
    };

    setDragging(which);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const p = getNormFromPointer(e);
    if (!p) return;

    if (onUserInteract) onUserInteract();

    const next = {
      x: clamp01(p.x - dragOffsetRef.current.x),
      y: clamp01(p.y - dragOffsetRef.current.y),
    };

    if (dragging === "A0" && setupEnabled) {
      setA0(next);
      return;
    }

    if (dragging === "C0" && setupEnabled) {
      setC0(next);
      return;
    }

    if (dragging === "planningCart" && planningMode && onPlanningCartChange) {
      onPlanningCartChange(next);
      return;
    }

    if (dragging === "target" && planningMode && onTargetChange) {
      onTargetChange(next);
    }
  }

  const liveCartPx =
    imageBox && liveCartNorm ? pxFromNormInBox(liveCartNorm, imageBox) : null;
  const planningCartPx =
    imageBox && planningCartNorm ? pxFromNormInBox(planningCartNorm, imageBox) : null;
  const targetPx =
    imageBox && targetNorm ? pxFromNormInBox(targetNorm, imageBox) : null;
  const A0px = imageBox ? pxFromNormInBox(A0, imageBox) : null;
  const C0px = imageBox ? pxFromNormInBox(C0, imageBox) : null;

  const displayCartNorm = planningMode ? planningCartNorm : liveCartNorm;
  const displayCartPx =
    imageBox && displayCartNorm ? pxFromNormInBox(displayCartNorm, imageBox) : null;

  function handleWhiteLinePointerDown(e) {
    if (!liveCartPx || !C0px || planningMode || !imageBox || !onEnterPlanning) return;

    e.preventDefault();
    e.stopPropagation();

    if (onUserInteract) onUserInteract();

    const p = getNormFromPointer(e);
    if (!p) return;

    const cp = closestPointOnSegment(p.px, liveCartPx, C0px);
    const nextTarget = {
      x: clamp01((cp.x - imageBox.left) / imageBox.width),
      y: clamp01((cp.y - imageBox.top) / imageBox.height),
    };

    onEnterPlanning(nextTarget);
  }

  const ringPx = ringPxFromAccuracy(youAccuracyMeters);

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
        ref={imgRef}
        src={imageSrc}
        alt="Hole"
        onLoad={handleImgLoad}
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
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {displayCartPx && C0px && !planningMode && (
          <>
            <line
              x1={displayCartPx.x}
              y1={displayCartPx.y}
              x2={C0px.x}
              y2={C0px.y}
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1={displayCartPx.x}
              y1={displayCartPx.y}
              x2={C0px.x}
              y2={C0px.y}
              stroke="rgba(0,0,0,0)"
              strokeWidth="26"
              strokeLinecap="round"
              style={{ pointerEvents: "stroke" }}
              onPointerDown={handleWhiteLinePointerDown}
            />
          </>
        )}

        {planningMode && planningCartPx && targetPx && C0px && (
          <>
            <line
              x1={planningCartPx.x}
              y1={planningCartPx.y}
              x2={targetPx.x}
              y2={targetPx.y}
              stroke="lime"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1={targetPx.x}
              y1={targetPx.y}
              x2={C0px.x}
              y2={C0px.y}
              stroke="lime"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {displayCartPx && (
        <>
          <div
            style={{
              position: "absolute",
              left: displayCartPx.x,
              top: displayCartPx.y,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: ringPx * 2,
                height: ringPx * 2,
                borderRadius: 999,
                border: "2px solid rgba(0,140,255,0.85)",
                background: "rgba(0,140,255,0.12)",
                boxShadow: "0 0 0 3px rgba(0,0,0,0.45)",
              }}
            />
          </div>

          <CartIcon px={displayCartPx} />
        </>
      )}

      {C0px && (
        <GreenMarker px={C0px} />
      )}

      {planningMode && targetPx && (
        <TargetMarker
          px={targetPx}
          onDown={(e) => onPointerDown("target", e)}
        />
      )}

      {planningMode && planningCartPx && (
        <PlanningCartHit
          px={planningCartPx}
          onDown={(e) => onPointerDown("planningCart", e)}
        />
      )}

      {setupEnabled && A0px && (
        <BuilderMarker
          label="A0"
          px={A0px}
          color="#ffd400"
          onDown={(e) => onPointerDown("A0", e)}
        />
      )}

      {setupEnabled && C0px && (
        <BuilderMarker
          label="C0"
          px={C0px}
          color="#ff5252"
          onDown={(e) => onPointerDown("C0", e)}
        />
      )}
    </div>
  );
}

function BuilderMarker({ label, px, color, onDown }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        zIndex: 8,
        cursor: "grab",
      }}
      onPointerDown={onDown}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "3px solid white",
          background: color,
          boxShadow: "0 0 0 3px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 12,
          color: "black",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function GreenMarker({ px }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          border: "3px solid white",
          boxShadow: "0 0 0 3px rgba(0,0,0,0.45)",
          background: "rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
}

function TargetMarker({ px, onDown }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        zIndex: 9,
        cursor: "grab",
      }}
      onPointerDown={onDown}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          border: "3px solid white",
          background: "orange",
          boxShadow: "0 0 0 3px rgba(0,0,0,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 8,
          height: 8,
          transform: "translate(-50%, -50%)",
          borderRadius: 999,
          background: "white",
        }}
      />
    </div>
  );
}

function PlanningCartHit({ px, onDown }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        width: 64,
        height: 64,
        borderRadius: 999,
        zIndex: 11,
        cursor: "grab",
      }}
      onPointerDown={onDown}
    />
  );
}

function CartIcon({ px }) {
  const W = 26;
  const H = 36;
  const x = 12;
  const y = 12;
  const wheelInset = 4;
  const wheelLen = 7;
  const whiteStroke = 2.6;
  const blackStroke = 5;

  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        pointerEvents: "none",
        filter:
          "drop-shadow(0 0 6px rgba(0,0,0,0.9)) drop-shadow(0 3px 8px rgba(0,0,0,0.65))",
      }}
    >
      <svg
        width={W + 24}
        height={H + 24}
        viewBox={`0 0 ${W + 24} ${H + 24}`}
        style={{ overflow: "visible" }}
      >
        <rect
          x={x}
          y={y}
          width={W}
          height={H}
          rx={4}
          ry={4}
          fill="none"
          stroke="black"
          strokeWidth={blackStroke}
        />

        <rect
          x={x}
          y={y}
          width={W}
          height={H}
          rx={4}
          ry={4}
          fill="rgba(0,170,255,0.82)"
          stroke="white"
          strokeWidth={whiteStroke}
        />

        <line
          x1={x + wheelInset}
          y1={y + 6}
          x2={x + wheelInset}
          y2={y + 6 + wheelLen}
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <line
          x1={x + wheelInset}
          y1={y + H - 6 - wheelLen}
          x2={x + wheelInset}
          y2={y + H - 6}
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
        />

        <line
          x1={x + W - wheelInset}
          y1={y + 6}
          x2={x + W - wheelInset}
          y2={y + 6 + wheelLen}
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <line
          x1={x + W - wheelInset}
          y1={y + H - 6 - wheelLen}
          x2={x + W - wheelInset}
          y2={y + H - 6}
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
        />

        <circle cx={x + W / 2} cy={y + H / 2} r={3} fill="white" />
      </svg>
    </div>
  );
}