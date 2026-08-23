"use client";

import { useEffect, useState } from "react";

// The mirror test, animated: a magpie meets its reflection. The reflection
// looks right — but three of its ten evidence dots are missing. The magpie
// knows. That knowing is the entire product.
type ScenePhase = "draw" | "meet" | "glitch" | "detect" | "verdict";

const PHASE_MS: Record<ScenePhase, number> = {
  draw: 1600,
  meet: 1800,
  glitch: 2000,
  detect: 1800,
  verdict: Number.MAX_SAFE_INTEGER,
};

const CAPTIONS: Record<ScenePhase, string> = {
  draw: "A MAGPIE MEETS A MIRROR",
  meet: "THE REFLECTION LOOKS PERFECT",
  glitch: "BUT THREE OF ITS TEN DOTS ARE MISSING",
  detect: "THE MAGPIE KNOWS — IT PASSES THE MIRROR TEST",
  verdict: "YOUR DASHBOARD IS A REFLECTION. MAGPIE KNOWS WHEN IT LIES.",
};

function Bird({ reflection = false, glitch = false }: { reflection?: boolean; glitch?: boolean }) {
  const dots = Array.from({ length: 10 });
  return (
    <g opacity={reflection ? 0.75 : 1}>
      {/* dot strip — the bird's evidence */}
      {dots.map((_, i) => {
        const missing = i >= 7;
        return (
          <circle
            key={i}
            cx={170 + i * 13}
            cy={126}
            r={3.2}
            className={
              reflection && missing && glitch ? "mirror-dot-missing" : undefined
            }
            fill={reflection && missing && glitch ? "none" : "#fafafa"}
            stroke={reflection && missing && glitch ? "#D71921" : "none"}
            strokeWidth={1.6}
          />
        );
      })}
      {/* bird */}
      <line x1="192" y1="196" x2="192" y2="222" stroke="#71717a" strokeWidth="3" strokeLinecap="round" />
      <line x1="216" y1="196" x2="216" y2="222" stroke="#71717a" strokeWidth="3" strokeLinecap="round" />
      <polygon points="152,150 118,130 128,146 114,148 148,162" fill={reflection ? "#27272a" : "#18181b"} />
      <ellipse cx="194" cy="168" rx="36" ry="30" fill={reflection ? "#27272a" : "#18181b"} />
      <path d="M172 162 Q194 196 220 174 Q206 194 184 190 Q168 180 172 162 Z" fill="#fafafa" opacity={reflection ? 0.6 : 1} />
      <circle cx="224" cy="136" r="19" fill={reflection ? "#27272a" : "#18181b"} />
      <polygon points="241,132 262,138 241,144" fill="#a1a1aa" />
      <circle cx="228" cy="131" r="4.5" fill="#D71921" className="magpie-eye" />
      <path d="M170 160 Q194 146 218 160 Q194 170 170 160 Z" fill="#000" stroke="#3f3f46" strokeWidth="1" />
    </g>
  );
}

export function MirrorScene() {
  const [phase, setPhase] = useState<ScenePhase>("draw");
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setPhase("draw");
    let cancelled = false;
    const order: ScenePhase[] = ["draw", "meet", "glitch", "detect", "verdict"];
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      if (cancelled) return;
      const current = order[index];
      setPhase(current);
      if (index < order.length - 1) {
        timer = setTimeout(() => {
          index += 1;
          advance();
        }, PHASE_MS[current]);
      }
    };
    advance();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [runId]);

  const order: ScenePhase[] = ["draw", "meet", "glitch", "detect", "verdict"];
  const past = (p: ScenePhase) => order.indexOf(phase) >= order.indexOf(p);

  return (
    <div className="dot-grid rounded-[4px] border border-zinc-800 bg-black p-4">
      <div className="flex items-center justify-between px-2 pb-2">
        <p className="font-dot text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600">
          MIRROR SELF-RECOGNITION TEST
        </p>
        <button
          type="button"
          onClick={() => setRunId((n) => n + 1)}
          className="font-dot text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200"
        >
          ↺ REPLAY
        </button>
      </div>
      <svg viewBox="0 0 720 280" className="w-full" role="img" aria-label="A magpie recognizes that its reflection is missing three evidence dots">
        {/* ground */}
        <line x1="40" y1="222" x2="680" y2="222" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />

        {/* mirror */}
        <g className={past("draw") ? "mirror-frame" : "mirror-frame mirror-frame-hidden"}>
          <rect x="380" y="30" width="290" height="192" rx="6" fill="#0d0d0d" stroke="#52525b" strokeWidth="3" pathLength={100} />
        </g>

        {/* real bird */}
        <g className={past("draw") ? "mirror-bird-in" : "mirror-bird-hidden"}>
          <Bird />
        </g>

        {/* reflection */}
        {past("meet") && (
          <g className={`mirror-reflection ${phase === "glitch" || past("detect") ? "mirror-glitch" : ""}`}>
            <g transform="translate(670,0) scale(-1,1)">
              <Bird reflection glitch={past("glitch")} />
            </g>
          </g>
        )}

        {/* scan line during detect */}
        {phase === "detect" && <line x1="390" y1="36" x2="390" y2="216" stroke="#D71921" strokeWidth="2" className="mirror-scan" />}

        {/* verdict stamp — inside the glass, clear of the frame */}
        {past("verdict") && (
          <g className="mirror-stamp">
            <rect x="452" y="46" width="150" height="26" rx="3" fill="none" stroke="#D71921" strokeWidth="1.5" />
            <text x="527" y="64" textAnchor="middle" fill="#D71921" fontSize="13" fontFamily="monospace" letterSpacing="3">
              7/10 — NOT REAL
            </text>
          </g>
        )}
      </svg>
      <p
        className={`px-2 pt-2 text-center font-dot text-[11px] font-bold uppercase leading-5 tracking-[0.2em] ${
          phase === "verdict" ? "text-[#ff5252]" : "text-zinc-400"
        }`}
      >
        {CAPTIONS[phase]}
      </p>
    </div>
  );
}
