import { useEffect, useRef, useState } from "react";

/*
HoleOverlay

Props used by App.jsx

imageSrc
resetKey
holeKey
setupEnabled
allowPlayB
viewMode
youNorm
youAccuracyMeters
onUserInteract
onStateChange
onActionsReady
*/

export default function HoleOverlay({
  imageSrc,
  resetKey,
  holeKey,
  setupEnabled,
  allowPlayB,
  viewMode,
  youNorm,
  onUserInteract,
  onStateChange,
  onActionsReady
}) {

  const imgRef = useRef(null);

  const [rect, setRect] = useState(null);

  const [A,setA] = useState({x:.5,y:.85});
  const [B,setB] = useState({x:.5,y:.5});
  const [C,setC] = useState({x:.5,y:.15});
  const [Bactive,setBactive] = useState(false);

  const dragRef = useRef(null);

  useEffect(()=>{
    const r = imgRef.current?.getBoundingClientRect();
    if(r) setRect(r);
  },[imageSrc]);

  useEffect(()=>{
    onStateChange?.({
      A,
      B,
      C,
      Bactive
    });
  },[A,B,C,Bactive]);

  useEffect(()=>{
    onActionsReady?.({
      clearTarget(){
        setBactive(false);
      },
      saveDefaults(){
        localStorage.setItem(
          "golfgps_defaults_"+holeKey,
          JSON.stringify({A,C})
        );
      },
      getState(){
        return {A,C};
      }
    });
  },[A,C,holeKey]);

  function startDrag(pt,e){
    e.preventDefault();
    dragRef.current=pt;
    onUserInteract?.();
  }

  function onMove(e){
    if(!dragRef.current) return;
    if(!rect) return;

    const x=(e.clientX-rect.left)/rect.width;
    const y=(e.clientY-rect.top)/rect.height;

    const p={
      x:Math.max(0,Math.min(1,x)),
      y:Math.max(0,Math.min(1,y))
    };

    if(dragRef.current==="A") setA(p);
    if(dragRef.current==="B") setB(p);
    if(dragRef.current==="C") setC(p);
  }

  function stopDrag(){
    dragRef.current=null;
  }

  useEffect(()=>{
    window.addEventListener("pointermove",onMove);
    window.addEventListener("pointerup",stopDrag);
    return ()=>{
      window.removeEventListener("pointermove",onMove);
      window.removeEventListener("pointerup",stopDrag);
    };
  },[rect]);

  function normToPx(p){
    if(!rect) return {x:0,y:0};
    return {
      x:p.x*rect.width,
      y:p.y*rect.height
    };
  }

  const Apx=normToPx(A);
  const Bpx=normToPx(B);
  const Cpx=normToPx(C);

  const cart=youNorm?normToPx(youNorm):null;

  function Marker({p,label,color,onDown}){

    const pos=normToPx(p);

    return(
      <div
        onPointerDown={onDown}
        style={{
          position:"absolute",
          left:pos.x-10,
          top:pos.y-10,
          width:20,
          height:20,
          borderRadius:20,
          background:color,
          border:"3px solid black",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontWeight:900,
          color:"white",
          fontSize:12,
          zIndex:5,
          cursor:"grab"
        }}
      >
        {label}
      </div>
    );
  }

  function CartIcon({p}){

    const pos=normToPx(p);

    return(
      <div
        style={{
          position:"absolute",
          left:pos.x-16,
          top:pos.y-12,
          width:32,
          height:24,
          background:"rgba(0,120,255,.55)",
          border:"3px solid white",
          outline:"2px solid black",
          borderRadius:4,
          zIndex:7
        }}
      >
        <div style={{
          position:"absolute",
          left:2,
          top:2,
          width:6,
          height:6,
          background:"black"
        }}/>
        <div style={{
          position:"absolute",
          right:2,
          top:2,
          width:6,
          height:6,
          background:"black"
        }}/>
        <div style={{
          position:"absolute",
          left:2,
          bottom:2,
          width:6,
          height:6,
          background:"black"
        }}/>
        <div style={{
          position:"absolute",
          right:2,
          bottom:2,
          width:6,
          height:6,
          background:"black"
        }}/>

        <div style={{
          position:"absolute",
          left:"50%",
          top:"50%",
          transform:"translate(-50%,-50%)",
          width:4,
          height:4,
          borderRadius:4,
          background:"white"
        }}/>
      </div>
    );
  }

  return(

    <div
      style={{
        position:"absolute",
        left:0,
        top:0,
        right:0,
        bottom:0
      }}
      onPointerDown={()=>{
        onUserInteract?.();

        if(viewMode==="drive" && rect){

          const x=(event.clientX-rect.left)/rect.width;
          const y=(event.clientY-rect.top)/rect.height;

          setB({x,y});
          setBactive(true);
        }
      }}
    >

      <img
        ref={imgRef}
        src={imageSrc}
        style={{
          width:"100%",
          height:"100%",
          objectFit:"contain",
          position:"absolute"
        }}
      />

      {viewMode==="aim" && rect && (
        <svg
          width={rect.width}
          height={rect.height}
          style={{
            position:"absolute",
            left:0,
            top:0,
            pointerEvents:"none",
            zIndex:2
          }}
        >
          <line
            x1={Apx.x}
            y1={Apx.y}
            x2={Cpx.x}
            y2={Cpx.y}
            stroke="lime"
            strokeWidth="3"
          />

          {Bactive && (
            <>
              <line
                x1={Apx.x}
                y1={Apx.y}
                x2={Bpx.x}
                y2={Bpx.y}
                stroke="yellow"
                strokeWidth="3"
              />
              <line
                x1={Bpx.x}
                y1={Bpx.y}
                x2={Cpx.x}
                y2={Cpx.y}
                stroke="yellow"
                strokeWidth="3"
              />
            </>
          )}
        </svg>
      )}

      {viewMode==="drive" && cart && rect && (
        <svg
          width={rect.width}
          height={rect.height}
          style={{
            position:"absolute",
            left:0,
            top:0,
            pointerEvents:"none",
            zIndex:3
          }}
        >
          <line
            x1={cart.x}
            y1={cart.y}
            x2={Cpx.x}
            y2={Cpx.y}
            stroke="white"
            strokeWidth="3"
          />

          <circle
            cx={Cpx.x}
            cy={Cpx.y}
            r="8"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      )}

      {setupEnabled && (
        <>
          <Marker p={A} label="A" color="green" onDown={(e)=>startDrag("A",e)}/>
          <Marker p={C} label="C" color="red" onDown={(e)=>startDrag("C",e)}/>
        </>
      )}

      {Bactive && viewMode==="aim" && (
        <Marker p={B} label="B" color="orange" onDown={(e)=>startDrag("B",e)}/>
      )}

      {cart && <CartIcon p={youNorm}/>}

    </div>
  );
}