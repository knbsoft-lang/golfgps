// src/components/HoleOverlay.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

const DEFAULT_A = { x: 0.5, y: 0.75 };
const DEFAULT_B = { x: 0.5, y: 0.5 };
const DEFAULT_C = { x: 0.5, y: 0.25 };

const BLOCK_B_NEAR_ENDPOINT_PX = 35;
const DOUBLE_TAP_MS = 350;

const HIT_A = 110;
const HIT_B = 80;
const HIT_C = 70;
const ACCURACY_RING_SCALE = 1.25;

function normPoint(p, fallback) {
  if (!p || typeof p.x !== "number" || typeof p.y !== "number") return fallback;
  return { x: clamp01(p.x), y: clamp01(p.y) };
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

function ringPxFromAccuracy(accuracyMeters) {
  if (typeof accuracyMeters !== "number" || !isFinite(accuracyMeters)) return 10;

  const m = Math.max(1, Math.min(30, accuracyMeters));
  const base = 8 + (m - 1) * (52 / 29);
  const shrunk = base * 0.35;
  const scaled = shrunk * ACCURACY_RING_SCALE;
  return Math.max(6, scaled);
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

export default function HoleOverlay({
  imageSrc,
  resetKey,
  holeKey,
  initialA,
  initialB,
  initialC,
  setupEnabled = false,
  allowPlayB = true,
  youNorm = null,
  youAccuracyMeters = null,
  viewMode = "aim",
  onUserInteract = null,
  onStateChange,
  onActionsReady,
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [containerRect, setContainerRect] = useState(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const lastBTapMsRef = useRef(0);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

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

  const fallbackA = useMemo(() => normPoint(initialA, DEFAULT_A), [initialA]);
  const fallbackC = useMemo(() => normPoint(initialC, DEFAULT_C), [initialC]);

  const defaultBFromAC = useMemo(
    () => ({
      x: clamp01((fallbackA.x + fallbackC.x) / 2),
      y: clamp01((fallbackA.y + fallbackC.y) / 2),
    }),
    [fallbackA, fallbackC]
  );

  const fallbackB = useMemo(
    () => normPoint(initialB, defaultBFromAC || DEFAULT_B),
    [initialB, defaultBFromAC]
  );

  const [A, setA] = useState(fallbackA);
  const [Bpos, setBpos] = useState(fallbackB);
  const [C, setC] = useState(fallbackC);
  const [Bactive, setBactive] = useState(true);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const nextA = normPoint(initialA, DEFAULT_A);
    const nextC = normPoint(initialC, DEFAULT_C);
    const nextMid = {
      x: clamp01((nextA.x + nextC.x) / 2),
      y: clamp01((nextA.y + nextC.y) / 2),
    };
    const nextB = normPoint(initialB, nextMid);

    setA(nextA);
    setBpos(nextB);
    setC(nextC);
    setBactive(true);
    setDragging(null);
    dragOffsetRef.current = { x: 0, y: 0 };
    lastBTapMsRef.current = 0;
  }, [resetKey, initialA, initialB, initialC]);

  function getState() {
    return { holeKey, A, B: Bpos, C, Bactive };
  }

  function getOverlayOnly() {
    return {
      A: { x: +A.x.toFixed(4), y: +A.y.toFixed(4) },
      B: { x: +Bpos.x.toFixed(4), y: +Bpos.y.toFixed(4) },
      C: { x: +C.x.toFixed(4), y: +C.y.toFixed(4) },
    };
  }

  function copyOverlayJson() {
    const payload = getOverlayOnly();
    const text = JSON.stringify(payload, null, 2);

    try {
      navigator.clipboard.writeText(text);
      window.alert(`Overlay copied for ${holeKey || "hole"}:\n\n${text}`);
    } catch {
      window.prompt("Copy this overlay JSON:", text);
    }
  }

  useEffect(() => {
    if (!onActionsReady) return;
    onActionsReady({
      getState,
      getOverlayOnly,
      copyOverlayJson,
    });
  }, [onActionsReady, holeKey, A, Bpos, C, Bactive]);

  useEffect(() => {
    if (!onStateChange) return;
    onStateChange(getState());
  }, [holeKey, A, Bpos, C, Bactive]);

  function endDrag() {
    setDragging(null);
    dragOffsetRef.current = { x: 0, y: 0 };
  }

  function canDrag(which) {
    if (which === "A" || which === "C") return true;
    if (which === "B") return setupEnabled || allowPlayB;
    return false;
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
    if (!canDrag(which)) return;

    if (which === "B") {
      if (!Bactive) return;

      const now = Date.now();
      if (now - lastBTapMsRef.current <= DOUBLE_TAP_MS) {
        lastBTapMsRef.current = 0;
        setBactive(false);
        setDragging(null);
        dragOffsetRef.current = { x: 0, y: 0 };
        return;
      }
      lastBTapMsRef.current = now;
    }

    const p = getNormFromPointer(e);
    if (!p) return;

    const center = which === "A" ? A : which === "B" ? Bpos : C;

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

    if (dragging === "A") {
      setA(next);
      return;
    }

    if (dragging === "C") {
      setC(next);
      return;
    }

    if (dragging === "B") {
      if (!Bactive) return;
      if (!canDrag("B")) return;
      setBpos(next);
    }
  }

  function onContainerPointerDown(e) {
    if (!setupEnabled && !allowPlayB) return;

    const p = getNormFromPointer(e);
    if (!p) return;

    if (onUserInteract) onUserInteract();

    setBpos({ x: p.x, y: p.y });
    setBactive(true);
    dragOffsetRef.current = { x: 0, y: 0 };
    setDragging("B");
  }

  function onLinePointerDown(e) {
    if (!setupEnabled && !allowPlayB) return;
    if (!imageBox) return;

    e.preventDefault();
    e.stopPropagation();

    if (onUserInteract) onUserInteract();

    const p = getNormFromPointer(e);
    if (!p) return;

    const Apx = pxFromNormInBox(A, imageBox);
    const Cpx = pxFromNormInBox(C, imageBox);

    if (
      distPx(p.px, Apx) < BLOCK_B_NEAR_ENDPOINT_PX ||
      distPx(p.px, Cpx) < BLOCK_B_NEAR_ENDPOINT_PX
    ) {
      return;
    }

    const cp = closestPointOnSegment(p.px, Apx, Cpx);
    const nextB = {
      x: clamp01((cp.x - imageBox.left) / imageBox.width),
      y: clamp01((cp.y - imageBox.top) / imageBox.height),
    };

    setBpos(nextB);
    setBactive(true);
    dragOffsetRef.current = { x: 0, y: 0 };
    setDragging("B");
  }

  const Apx = imageBox ? pxFromNormInBox(A, imageBox) : { x: 0, y: 0 };
  const Bpx = imageBox ? pxFromNormInBox(Bpos, imageBox) : { x: 0, y: 0 };
  const Cpx = imageBox ? pxFromNormInBox(C, imageBox) : { x: 0, y: 0 };

  const lineClickable = setupEnabled || allowPlayB;

  const [youSmooth, setYouSmooth] = useState(null);
  const animRef = useRef({ raf: 0, from: null, to: null, t0: 0 });

  useEffect(() => {
    if (
      !youNorm ||
      typeof youNorm.x !== "number" ||
      typeof youNorm.y !== "number"
    ) {
      if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);
      animRef.current = { raf: 0, from: null, to: null, t0: 0 };
      setYouSmooth(null);
      return;
    }

    const target = { x: clamp01(youNorm.x), y: clamp01(youNorm.y) };
    const start = youSmooth ? { ...youSmooth } : target;

    if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);

    animRef.current.from = start;
    animRef.current.to = target;
    animRef.current.t0 = performance.now();

    const DURATION_MS = 350;

    const step = (now) => {
      const t = Math.max(0, Math.min(1, (now - animRef.current.t0) / DURATION_MS));
      const e = 1 - Math.pow(1 - t, 3);

      const x =
        animRef.current.from.x +
        (animRef.current.to.x - animRef.current.from.x) * e;
      const y =
        animRef.current.from.y +
        (animRef.current.to.y - animRef.current.from.y) * e;

      setYouSmooth({ x, y });

      if (t < 1) {
        animRef.current.raf = requestAnimationFrame(step);
      } else {
        animRef.current.raf = 0;
      }
    };

    animRef.current.raf = requestAnimationFrame(step);

    return () => {
      if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);
      animRef.current.raf = 0;
    };
  }, [youNorm?.x, youNorm?.y]);

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
      onPointerDown={onContainerPointerDown}
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

      {viewMode === "aim" && (
        <>
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

          {youSmooth && imageBox && (
            <div
              style={{
                position: "absolute",
                left: Apx.x,
                top: Apx.y,
                transform: "translate(-50%, -50%)",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
          )}

          {youSmooth && imageBox && (
            <div
              style={{
                position: "absolute",
                left: imageBox.left + youSmooth.x * imageBox.width,
                top: imageBox.top + youSmooth.y * imageBox.height,
                transform: "translate(-50%, -50%)",
                zIndex: 4,
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
          )}

          <Marker
            kind="A"
            px={Apx}
            onDown={(e) => onPointerDown("A", e)}
            pointerEnabled={true}
            cursor="grab"
            hitSize={HIT_A}
          />

          {Bactive && (
            <Marker
              kind="B"
              px={Bpx}
              onDown={(e) => onPointerDown("B", e)}
              pointerEnabled={setupEnabled || allowPlayB}
              cursor={setupEnabled || allowPlayB ? "grab" : "default"}
              hitSize={HIT_B}
            />
          )}

          <Marker
            kind="C"
            px={Cpx}
            onDown={(e) => onPointerDown("C", e)}
            pointerEnabled={true}
            cursor="grab"
            hitSize={HIT_C}
          />
        </>
      )}

      {viewMode === "drive" && youSmooth && imageBox && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
            zIndex: 4,
            overflow: "visible",
          }}
        >
          <line
            x1={imageBox.left + youSmooth.x * imageBox.width}
            y1={imageBox.top + youSmooth.y * imageBox.height}
            x2={Cpx.x}
            y2={Cpx.y}
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx={Cpx.x}
            cy={Cpx.y}
            r={8}
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      )}

      {youSmooth && imageBox && (
        <CartIcon
          px={{
            x: imageBox.left + youSmooth.x * imageBox.width,
            y: imageBox.top + youSmooth.y * imageBox.height,
          }}
        />
      )}
    </div>
  );
}

function Marker({ kind, px, onDown, pointerEnabled, cursor, hitSize }) {
  const hs = typeof hitSize === "number" ? hitSize : 44;
  const visibleSize = kind === "A" ? 36 : kind === "B" ? 36 : 22;
  const dotSize = kind === "A" ? 11 : kind === "C" ? 5 : 6;
  const borderRadius = kind === "A" ? 6 : 999;
  const boxOffsetY = kind === "A" ? 24 : kind === "B" ? 0 : 0;
  const dotOffsetY = 0;

  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
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
          top: `calc(50% + ${boxOffsetY}px)`,
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
          top: `calc(50% + ${dotOffsetY}px)`,
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