import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}

function distNorm(p1, p2) {
  const dx = (p2?.x ?? 0) - (p1?.x ?? 0);
  const dy = (p2?.y ?? 0) - (p1?.y ?? 0);
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

function lineEndpointOutsideCircle(from, to, radius) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (!isFinite(len) || len < 0.0001) return { x: from.x, y: from.y };
  return {
    x: from.x + (dx / len) * radius,
    y: from.y + (dy / len) * radius,
  };
}

export default function HoleOverlay({
  imageSrc,
  resetKey,
  initialA0,
  initialC0,
  setupEnabled = false,
  liveCartNorm = null,
  planningMode = false,
  planningCartNorm = null,
  targetNorm = null,
  targetVisible = false,
  targetSuppressRadiusNorm = 0,
  onEnterPlanning = null,
  onPlanningCartChange = null,
  onTargetChange = null,
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [containerRect, setContainerRect] = useState(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const [dragging, setDragging] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const [A0, setA0] = useState(initialA0);
  const [C0, setC0] = useState(initialC0);

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
    setA0(initialA0);
    setC0(initialC0);
    setDragging(null);
    dragOffsetRef.current = { x: 0, y: 0 };
  }, [resetKey, initialA0, initialC0]);

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

    const p = getNormFromPointer(e);
    if (!p) return;

    let center = null;

    if (which === "planningCart" && planningMode && planningCartNorm) center = planningCartNorm;
    if (which === "target" && planningMode && targetNorm && targetVisible) center = targetNorm;

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

    const next = {
      x: clamp01(p.x - dragOffsetRef.current.x),
      y: clamp01(p.y - dragOffsetRef.current.y),
    };

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
  const A0px = imageBox && A0 ? pxFromNormInBox(A0, imageBox) : null;
  const C0px = imageBox && C0 ? pxFromNormInBox(C0, imageBox) : null;

  const displayCartNorm = planningMode ? planningCartNorm : liveCartNorm;
  const displayCartPx =
    imageBox && displayCartNorm ? pxFromNormInBox(displayCartNorm, imageBox) : null;

  const MARKER_SIZE = 34;
  const MARKER_RADIUS = MARKER_SIZE / 2;
  const CART_RADIUS = MARKER_SIZE / 2;

  function handleLineTap(e, fromCart = false) {
    if (!imageBox || !displayCartPx || !C0px || !onEnterPlanning) return;

    e.preventDefault();
    e.stopPropagation();

    const p = getNormFromPointer(e);
    if (!p) return;

    const cp = closestPointOnSegment(p.px, displayCartPx, C0px);
    const nextTarget = {
      x: clamp01((cp.x - imageBox.left) / imageBox.width),
      y: clamp01((cp.y - imageBox.top) / imageBox.height),
    };

    const cartNormForDecision = planningMode ? planningCartNorm : liveCartNorm;
    const nearCart =
      cartNormForDecision &&
      distNorm(cartNormForDecision, nextTarget) <= (targetSuppressRadiusNorm || 0);

    if (!planningMode) {
      if (fromCart || nearCart) {
        onEnterPlanning(null);
      } else {
        onEnterPlanning(nextTarget);
      }
      return;
    }

    if (nearCart) return;
    if (onTargetChange) onTargetChange(nextTarget);
  }

  const normalLine =
    displayCartPx && C0px
      ? {
          from: lineEndpointOutsideCircle(displayCartPx, C0px, CART_RADIUS),
          to: lineEndpointOutsideCircle(C0px, displayCartPx, MARKER_RADIUS),
        }
      : null;

  const planningGreenLine =
    planningMode && displayCartPx && C0px && !targetVisible
      ? {
          from: lineEndpointOutsideCircle(displayCartPx, C0px, CART_RADIUS),
          to: lineEndpointOutsideCircle(C0px, displayCartPx, MARKER_RADIUS),
        }
      : null;

  const planningCartToTargetLine =
    planningMode && planningCartPx && targetPx && targetVisible
      ? {
          from: lineEndpointOutsideCircle(planningCartPx, targetPx, CART_RADIUS),
          to: lineEndpointOutsideCircle(targetPx, planningCartPx, MARKER_RADIUS),
        }
      : null;

  const targetToGreenLine =
    planningMode && targetPx && targetVisible && C0px
      ? {
          from: lineEndpointOutsideCircle(targetPx, C0px, MARKER_RADIUS),
          to: lineEndpointOutsideCircle(C0px, targetPx, MARKER_RADIUS),
        }
      : null;

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
        {normalLine && !planningMode && (
          <>
            <line
              x1={normalLine.from.x}
              y1={normalLine.from.y}
              x2={normalLine.to.x}
              y2={normalLine.to.y}
              stroke="lime"
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
              onPointerDown={(e) => handleLineTap(e, false)}
            />
          </>
        )}

        {planningGreenLine && (
          <>
            <line
              x1={planningGreenLine.from.x}
              y1={planningGreenLine.from.y}
              x2={planningGreenLine.to.x}
              y2={planningGreenLine.to.y}
              stroke="lime"
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
              onPointerDown={(e) => handleLineTap(e, false)}
            />
          </>
        )}

        {planningCartToTargetLine && targetToGreenLine && (
          <>
            <line
              x1={planningCartToTargetLine.from.x}
              y1={planningCartToTargetLine.from.y}
              x2={planningCartToTargetLine.to.x}
              y2={planningCartToTargetLine.to.y}
              stroke="lime"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1={targetToGreenLine.from.x}
              y1={targetToGreenLine.from.y}
              x2={targetToGreenLine.to.x}
              y2={targetToGreenLine.to.y}
              stroke="lime"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {displayCartPx && (
        <>
          <CartHitArea
            px={displayCartPx}
            onDown={(e) => {
              if (!planningMode) {
                handleLineTap(e, true);
                return;
              }
              onPointerDown("planningCart", e);
            }}
          />

          <CartIcon px={displayCartPx} size={MARKER_SIZE} />
        </>
      )}

      {C0px && <GreenMarker px={C0px} size={MARKER_SIZE} />}

      {planningMode && targetPx && targetVisible && (
        <TargetMarker
          px={targetPx}
          size={MARKER_SIZE}
          onDown={(e) => onPointerDown("target", e)}
        />
      )}

      {setupEnabled && A0px && (
        <TemplateAnchor px={A0px} size={MARKER_SIZE} color="#ffd400" />
      )}
    </div>
  );
}

function Crosshair({ color = "white" }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 12,
          height: 2,
          transform: "translate(-50%, -50%)",
          background: color,
          borderRadius: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2,
          height: 12,
          transform: "translate(-50%, -50%)",
          background: color,
          borderRadius: 2,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function TemplateAnchor({ px, size, color }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        zIndex: 8,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          border: `3px solid ${color}`,
          background: "transparent",
        }}
      />
      <Crosshair color="white" />
    </div>
  );
}

function GreenMarker({ px, size }) {
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
          width: size,
          height: size,
          borderRadius: 999,
          border: "3px solid lime",
          background: "rgba(0,255,0,0.06)",
        }}
      />
      <Crosshair color="white" />
    </div>
  );
}

function TargetMarker({ px, size, onDown }) {
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
          width: size,
          height: size,
          borderRadius: 999,
          border: "3px solid lime",
          background: "rgba(0,255,0,0.04)",
        }}
      />
      <Crosshair color="white" />
    </div>
  );
}

function CartHitArea({ px, onDown }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        width: 72,
        height: 72,
        borderRadius: 999,
        zIndex: 11,
        cursor: "grab",
      }}
      onPointerDown={onDown}
    />
  );
}

function CartIcon({ px, size }) {
  return (
    <div
      style={{
        position: "absolute",
        left: px.x,
        top: px.y,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          border: "3px solid lime",
          background: "rgba(0,255,0,0.06)",
        }}
      />
      <Crosshair color="white" />
    </div>
  );
}
