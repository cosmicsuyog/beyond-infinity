// OpsPulse — Cinematic Boot Loader
// SpaceX-inspired design system: #000 + #f0f0fa, Bebas Neue, Barlow Condensed
// Usage: render <OpsPulseLoader onComplete={() => setLoaded(true)} />

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

/* ── GOOGLE FONTS ── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600&display=swap');
  `}</style>
);

/* ── CONSTANTS ── */
const DURATION_MS = 3000;

const PHASE_MESSAGES = [
  { at: 0.00, label: "SYSTEM INITIALIZING...",    status: "BOOT SEQUENCE — INITIALIZING" },
  { at: 0.15, label: "LOADING CORE MODULES...",   status: "INCIDENT ENGINE — LOADING"    },
  { at: 0.32, label: "ESTABLISHING STREAMS...",   status: "MONITOR STREAMS — ACTIVE"     },
  { at: 0.52, label: "CALIBRATING VECTORS...",    status: "ALERT SYSTEM — CALIBRATING"   },
  { at: 0.72, label: "VALIDATING SIGNATURES...",  status: "NODE MESH — VALIDATING"       },
  { at: 0.88, label: "RESPONSE MESH ONLINE...",   status: "RESPONSE ENGINE — SYNCING"    },
  { at: 0.98, label: "ALL SYSTEMS NOMINAL",       status: "OPSPULSE — OPERATIONAL"       },
];

const TERMINAL_LINES = [
  "INIT_OPSPULSE_CORE",
  "LOADING_INCIDENT_ENGINE",
  "ESTABLISHING_MONITOR_STREAMS",
  "SYNCING_ALERT_VECTORS",
  "VALIDATING_NODE_SIGNATURES",
  "CALIBRATING_RESPONSE_MESH",
  "ALL_SYSTEMS_NOMINAL",
];

const TERM_TRIGGERS = [0, 0.14, 0.28, 0.44, 0.60, 0.76, 0.92];

/* ── WAVEFORM CANVAS ── */
const WaveCanvas = ({ phaseRef }) => {
  const canvasRef = useRef(null);
  const phaseAngle = useRef(0);
  const animRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = phaseRef.current;
      ctx.clearRect(0, 0, W, H);
      const cy = H * 0.5;
      const amp = 18 + p * 8;
      const freq = 0.022 + p * 0.008;

      const waveConfig = [
        { alpha: 0.55, phOff: 0,   scale: 1.0,  lw: 1.2 },
        { alpha: 0.28, phOff: 0.4, scale: 0.7,  lw: 0.7 },
        { alpha: 0.14, phOff: 0.8, scale: 0.45, lw: 0.5 },
        { alpha: 0.20, phOff: 1.2, scale: 0.6,  lw: 0.6 },
        { alpha: 0.07, phOff: 1.6, scale: 0.3,  lw: 0.4 },
      ];

      waveConfig.forEach(({ alpha, phOff, scale, lw }) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(240,240,250,${alpha})`;
        ctx.lineWidth = lw;
        for (let x = 0; x <= W; x += 2) {
          const y =
            cy +
            Math.sin(x * freq + phaseAngle.current + phOff) * amp * scale +
            Math.sin(x * freq * 0.5 + phaseAngle.current * 0.7 + phOff * 1.3) * amp * 0.3 * scale;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      /* scan sweep */
      const sx = ((ts - startRef.current) * 0.12) % (W + 40) - 20;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(240,240,250,0.055)";
      ctx.lineWidth = 20;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, H);
      ctx.stroke();

      /* node dots */
      if (p > 0.2) {
        const nodes = [
          [W * 0.22, cy - 14],
          [W * 0.48, cy + 10],
          [W * 0.72, cy - 8],
          [W * 0.88, cy + 5],
        ];
        nodes.forEach(([nx, ny], i) => {
          const t = ts * 0.003;
          const r = 2.5 + Math.sin(t + i) * 1;
          ctx.beginPath();
          ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240,240,250,${0.5 + p * 0.3})`;
          ctx.fill();
          if (p > 0.5) {
            ctx.beginPath();
            ctx.arc(nx, ny, r + 4 + Math.sin(t + i) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(240,240,250,${0.1 + Math.sin(t + i) * 0.05})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        });
      }

      phaseAngle.current += 0.032;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phaseRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
};

/* ── SCANLINES ── */
const Scanlines = () => (
  <div
    style={{
      position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
      background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(240,240,250,0.016) 2px,rgba(240,240,250,0.016) 4px)",
    }}
  />
);

/* ── FRAME CORNER ── */
const FrameCorner = ({ pos }) => {
  const borders = {
    tl: "1px 0 0 1px",
    tr: "1px 1px 0 0",
    bl: "0 0 1px 1px",
    br: "0 1px 1px 0",
  };
  const position = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };
  return (
    <div
      style={{
        position: "absolute", width: 18, height: 18,
        borderColor: "#f0f0fa", borderStyle: "solid",
        borderWidth: borders[pos], opacity: 0.7,
        ...position[pos],
      }}
    />
  );
};

/* ── LABEL STYLE HELPERS ── */
const barlow = (s) => ({
  fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif",
  ...s,
});
const bebas = (s) => ({
  fontFamily: "'Bebas Neue',Impact,sans-serif",
  ...s,
});

/* ── MAIN COMPONENT ── */
export default function OpsPulseLoader({ onComplete, duration = DURATION_MS }) {
  const [pct, setPct]         = useState(0);
  const [phase, setPhase]     = useState(PHASE_MESSAGES[0]);
  const [termLine, setTermLine] = useState(-1);
  const [telSig, setTelSig]   = useState("--");
  const [telCoords, setTelCoords] = useState({ x: "---", y: "---", freq: "--.--", lat: "28.6139° N", latency: "---" });
  const [sysTime, setSysTime]  = useState("--:--:--");
  const [done, setDone]        = useState(false);

  const phaseRef = useRef(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const telRef   = useRef(null);
  const termRef  = useRef(-1);
  const loaderRef = useRef(null);

  /* telemetry flicker */
  const startTelemetry = useCallback(() => {
    clearInterval(telRef.current);
    telRef.current = setInterval(() => {
      setTelCoords({
        x:       String(Math.floor(Math.random() * 900) + 100),
        y:       String(Math.floor(Math.random() * 99)),
        freq:    (24 + Math.random() * 3).toFixed(1),
        lat:     "28.6139° N",
        latency: String(Math.floor(Math.random() * 20) + 8),
      });
      setTelSig(`${Math.floor(Math.random() * 11) + 88}.${Math.floor(Math.random() * 9) + 1}%`);
      const n = new Date();
      setSysTime(`${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`);
    }, 120);
  }, []);

  /* main animation loop */
  const startLoop = useCallback(() => {
    startRef.current = null;
    termRef.current = -1;

    const loop = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      phaseRef.current = p;

      setPct(Math.floor(p * 100));

      let msg = PHASE_MESSAGES[0];
      PHASE_MESSAGES.forEach((m) => { if (p >= m.at) msg = m; });
      setPhase(msg);

      TERM_TRIGGERS.forEach((t, i) => {
        if (p >= t && termRef.current < i) {
          termRef.current = i;
          setTermLine(i);
        }
      });

      if (p < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        clearInterval(telRef.current);
        setTelSig("99.98%");
        setTelCoords((c) => ({ ...c, latency: "12", freq: "24.9" }));
        setDone(true);
        
        // Smooth transition animation before completing
        if (loaderRef.current) {
          gsap.timeline()
            .to(loaderRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: 'power3.inOut',
              onComplete: () => {
                onComplete?.();
              }
            });
        } else {
          onComplete?.();
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [duration, onComplete]);

  useEffect(() => {
    startTelemetry();
    startLoop();
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(telRef.current);
    };
  }, [startTelemetry, startLoop]);

  const restart = () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(telRef.current);
    setPct(0);
    setPhase(PHASE_MESSAGES[0]);
    setTermLine(-1);
    setDone(false);
    phaseRef.current = 0;
    startTelemetry();
    startLoop();
  };

  return (
    <>
      <Fonts />
      <div
        ref={loaderRef}
        style={{
          width: "100%", minHeight: "100vh", background: "#000000",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* WAVEFORM */}
        <WaveCanvas phaseRef={phaseRef} />
        <Scanlines />

        {/* LOGO */}
        <div style={bebas({ position: "absolute", top: 22, left: 40, zIndex: 12, fontSize: 16, letterSpacing: "0.22em", color: "rgba(240,240,250,0.55)" })}>
          OPSPULSE
        </div>

        {/* TOP RIGHT STATUS */}
        <div style={{ position: "absolute", top: 22, right: 40, zIndex: 12, textAlign: "right" }}>
          <div style={barlow({ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,240,250,0.45)" })}>
            {phase.status}
          </div>
          <div style={barlow({ fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,240,250,0.28)", marginTop: 3 })}>
            SYS_CLOCK: {sysTime}
          </div>
        </div>

        {/* SIGNAL FRAME */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 460, height: 180 }}>
          {["tl","tr","bl","br"].map((p) => <FrameCorner key={p} pos={p} />)}
          {[
            { cls: "tl", text: `X:${telCoords.x} Y:${telCoords.y}`, style: { top: -16, left: 0 } },
            { cls: "tr", text: `FREQ: ${telCoords.freq} HZ`, style: { top: -16, right: 0 } },
            { cls: "bl", text: "CHAN: ALPHA-7", style: { bottom: -16, left: 0 } },
            { cls: "br", text: `LATENCY: ${telCoords.latency}ms`, style: { bottom: -16, right: 0 } },
          ].map(({ cls, text, style }) => (
            <div key={cls} style={barlow({ position: "absolute", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,240,250,0.4)", ...style })}>
              {text}
            </div>
          ))}
        </div>

        {/* PERCENTAGE */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 11, pointerEvents: "none" }}>
          <div style={barlow({
            fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(240,240,250,0.55)", marginBottom: 4,
            border: "1px solid rgba(240,240,250,0.22)", padding: "3px 14px", display: "inline-block",
          })}>
            {phase.label}
          </div>
          <div style={bebas({ fontSize: 96, letterSpacing: "0.04em", color: "#f0f0fa", lineHeight: 0.92, display: "block" })}>
            {pct}<span style={{ fontSize: 52 }}>%</span>
          </div>
        </div>

        {/* TERMINAL */}
        <div style={{ position: "absolute", bottom: 40, left: 40, zIndex: 12 }}>
          {TERMINAL_LINES.map((line, i) => {
            const isActive = termLine === i;
            const isDone   = termLine > i;
            return (
              <div
                key={i}
                style={barlow({
                  fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                  lineHeight: 1.8, opacity: isDone || isActive ? 1 : 0,
                  transition: "opacity 0.3s",
                  color: isActive ? "rgba(240,240,250,0.65)" : "rgba(240,240,250,0.28)",
                })}
              >
                <span style={{ color: "rgba(240,240,250,0.4)", marginRight: 4 }}>{">"}</span>
                {line}
                {isActive && (
                  <span style={{
                    display: "inline-block", width: 6, height: 9,
                    background: "rgba(240,240,250,0.7)", verticalAlign: "middle",
                    marginLeft: 3,
                    animation: "opsBlink 0.7s step-end infinite",
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT TELEMETRY */}
        <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", zIndex: 12, textAlign: "right" }}>
          {[
            { label: "SYS UPTIME", val: "99.98%" },
            { label: "LAT COORD",  val: telCoords.lat },
            { label: "SIGNAL",     val: telSig },
          ].map(({ label, val }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={barlow({ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(240,240,250,0.3)", marginBottom: 2 })}>{label}</div>
              <div style={bebas({ fontSize: 18, letterSpacing: "0.1em", color: "rgba(240,240,250,0.78)" })}>{val}</div>
            </div>
          ))}
          <div style={barlow({
            display: "inline-block", background: "rgba(240,240,250,0.08)",
            border: "1px solid rgba(240,240,250,0.28)", padding: "3px 10px",
            fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
            color: done ? "#f0f0fa" : "rgba(240,240,250,0.6)", marginTop: 6,
          })}>
            {done ? "AUTHENTICATED" : "ENCRYPTED"}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", width: 320, zIndex: 12 }}>
          <div style={barlow({ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(240,240,250,0.3)", marginBottom: 7, textAlign: "right" })}>
            MOUNTING SUBSYSTEMS — {pct}%
          </div>
          <div style={{ height: 1, background: "rgba(240,240,250,0.1)", position: "relative" }}>
            <div style={{
              height: 1, background: "#f0f0fa", width: `${pct}%`,
              transition: "width 0.12s linear", position: "relative",
            }}>
              <div style={{ position: "absolute", right: -1, top: -3, width: 1, height: 7, background: "#f0f0fa" }} />
            </div>
          </div>
        </div>

        {/* RESTART */}
        <button
          onClick={restart}
          style={barlow({
            position: "absolute", bottom: 20, right: 40, zIndex: 20,
            background: "rgba(240,240,250,0.06)", border: "1px solid rgba(240,240,250,0.22)",
            borderRadius: 32, padding: "6px 18px", fontSize: 9.5,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(240,240,250,0.5)", cursor: "pointer",
          })}
        >
          ↺ REPLAY
        </button>

        {/* BLINK KEYFRAMES */}
        <style>{`@keyframes opsBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </div>
    </>
  );
}
