import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSilkscreen } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const dot = loadSilkscreen().fontFamily;
const sans = loadInter().fontFamily;
const mono = "SF Mono, Menlo, monospace";

const RED = "#D71921";
const INK = "#0a0b0c";
const SURFACE = "#111315";
const LINE = "#222222";
const Z3 = "#d4d4d8";
const Z4 = "#a1a1aa";
const Z5 = "#71717a";
const GREEN = "#22c55e";

// Fast-but-clear motion: high-stiffness springs with overshoot, tight
// staggers, count-up numerals, animated segmented (e-ink) bars, subtle
// camera push-ins. One red emphasis beat per scene, no overlaps.

const snap = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 190 } });

function Dot({
  children,
  size = 28,
  color = "#fafafa",
  style,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: dot,
        fontSize: size,
        fontWeight: 700,
        color,
        letterSpacing: "0.1em",
        lineHeight: 1.35,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Count({
  from,
  to,
  size = 64,
  color = "#fafafa",
  delay = 0,
  style,
}: {
  from: number;
  to: number;
  size?: number;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = Math.round(
    interpolate(spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 90 } }), [0, 1], [from, to]),
  );
  return (
    <span style={{ fontFamily: mono, fontSize: size, fontWeight: 700, color, ...style }}>{v}</span>
  );
}

function SegBar({
  width,
  height,
  color,
  grow,
  block = true,
}: {
  width: number;
  height: number;
  color: string;
  grow: number;
  block?: boolean;
}) {
  return (
    <div
      style={{
        width: width * grow,
        height,
        background: block
          ? `repeating-linear-gradient(90deg, ${color} 0 7px, transparent 7px 11px)`
          : color,
        borderRadius: 2,
      }}
    />
  );
}

function Wipe() {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 10], [-260, 2100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        width: 14,
        height: 1080,
        background: RED,
        opacity: 0.9,
      }}
    />
  );
}

function Bird({
  x,
  y,
  scale = 1,
  opacity = 1,
  missingDots = 0,
  flickerFrame,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  missingDots?: number;
  flickerFrame?: number;
}) {
  const dots = Array.from({ length: 10 });
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {dots.map((_, i) => {
        const missing = i >= 10 - missingDots;
        const flicker =
          missing && flickerFrame !== undefined
            ? 0.35 + 0.65 * Math.abs(Math.sin(flickerFrame / 4))
            : 1;
        return (
          <circle
            key={i}
            cx={i * 26}
            cy={-92}
            r={6.5}
            fill={missing ? "none" : "#fafafa"}
            stroke={missing ? RED : "none"}
            strokeWidth={3}
            opacity={missing ? flicker : 1}
          />
        );
      })}
      <line x1={0} y1={0} x2={0} y2={52} stroke={Z5} strokeWidth={6} strokeLinecap="round" />
      <line x1={48} y1={0} x2={48} y2={52} stroke={Z5} strokeWidth={6} strokeLinecap="round" />
      <polygon points="-84,-40 -152,-80 -132,-48 -160,-44 -76,-16" fill="#18181b" />
      <ellipse cx={0} cy={-64} rx={72} ry={60} fill="#18181b" />
      <path d="M-44 -76 Q0 -8 52 -48 Q24 8 -24 0 -52 -20 -44 -76 Z" fill="#fafafa" opacity={0.92} />
      <circle cx={60} cy={-124} r={38} fill="#18181b" />
      <polygon points="94,-132 136,-120 94,-108" fill={Z4} />
      <circle cx={66} cy={-130} r={9} fill={RED} />
      <path d="M-40 -84 Q0 -112 44 -84 Q0 -64 -40 -84 Z" fill="#000" stroke={LINE} strokeWidth={2} />
    </g>
  );
}

/* ---------- SCENE 1 · LOGO BURST (0-100) ---------- */
function SceneLogo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineW = interpolate(frame, [0, 18], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const word = "MAGPIE.".split("");
  const sub = snap(frame, fps, 42);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 220, left: 0, width: lineW, height: 4, background: RED }} />
      <div style={{ position: "absolute", bottom: 220, right: 0, width: lineW, height: 4, background: "#2a2a2d" }} />
      <div style={{ display: "flex" }}>
        {word.map((letter, i) => {
          const s = snap(frame, fps, 8 + i * 3);
          return (
            <Dot
              key={i}
              size={170}
              color={letter === "." ? RED : "#fafafa"}
              style={{
                opacity: Math.min(1, s * 1.4),
                transform: `translateY(${(1 - s) * 90}px) scale(${0.8 + s * 0.2})`,
              }}
            >
              {letter}
            </Dot>
          );
        })}
      </div>
      <div style={{ marginTop: 26, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>
        <Dot size={30} color={Z4}>
          EVIDENCE INTELLIGENCE FOR B2B GEO
        </Dot>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 2 · MIRROR TEST (100-310) ---------- */
function SceneMirror() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameDraw = interpolate(frame, [5, 40], [1, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const birdIn = snap(frame, fps, 15);
  const reflectIn = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const glitch = frame > 95;
  const scan = interpolate(frame, [115, 145], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const stampS = snap(frame, fps, 150);
  const shake = frame >= 150 && frame < 162 ? Math.sin(frame * 2.4) * 5 : 0;
  const caption =
    frame >= 150 ? 3 : frame >= 115 ? 2 : frame >= 95 ? 1 : 0;
  const captions = [
    "A MAGPIE MEETS A MIRROR",
    "THREE OF ITS TEN DOTS ARE MISSING",
    "THE MAGPIE KNOWS — IT PASSES THE MIRROR TEST",
    "YOUR DASHBOARD IS A REFLECTION. MAGPIE KNOWS WHEN IT LIES.",
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <line x1={140} y1={940} x2={1780} y2={940} stroke={LINE} strokeWidth={4} />
        <rect
          x={1060}
          y={250}
          width={700}
          height={570}
          rx={8}
          fill="#0d0d0d"
          stroke="#52525b"
          strokeWidth={7}
          strokeDasharray={3200}
          strokeDashoffset={3200 * frameDraw}
        />
        <g opacity={birdIn} transform={`translate(${(1 - birdIn) * -280}, 0)`}>
          <Bird x={600} y={880} scale={1.55} />
        </g>
        <g opacity={reflectIn}>
          <g transform={`translate(1760, 880) scale(-1.55, 1.55)`}>
            <Bird x={0} y={0} missingDots={glitch ? 3 : 0} flickerFrame={frame} opacity={0.75} />
          </g>
        </g>
        {frame >= 115 && frame <= 155 && (
          <line x1={1080 + scan * 640} y1={270} x2={1080 + scan * 640} y2={800} stroke={RED} strokeWidth={5} />
        )}
        {frame >= 150 && (
          <g transform={`translate(${1410 + shake}, 330) scale(${Math.max(0.001, stampS)})`} opacity={Math.min(1, stampS * 1.3)}>
            <rect x={-230} y={-46} width={460} height={92} rx={6} fill="none" stroke={RED} strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fill={RED} fontSize={44} fontFamily={mono} letterSpacing={5}>
              7/10 — NOT REAL
            </text>
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", bottom: 100, width: "100%", textAlign: "center" }}>
        <Dot size={34} color={caption === 3 ? RED : Z4}>{captions[caption]}</Dot>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 3 · THE LIE (310-560) ---------- */
function SceneLie() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = ["RUN SUCCEEDED.", "JSON VALID.", "BUSINESS CONCLUSION WRONG."];
  const stage = frame < 80 ? 0 : frame < 160 ? 1 : 2;
  const barGrow = [
    interpolate(spring({ frame: frame - 10, fps, config: { damping: 15 } }), [0, 1], [0, 1]),
    interpolate(spring({ frame: frame - 90, fps, config: { damping: 15 } }), [0, 1], [1, 0.7]),
    interpolate(spring({ frame: frame - 170, fps, config: { damping: 15 } }), [0, 1], [0.7, 1]),
  ];
  const chips = [
    [{ t: "10/10 ROWS · TRUSTED", c: Z4 }],
    [
      { t: "RATIO 70% — BLOCKING", c: RED },
      { t: "MIN RANK 4 — BLOCKING", c: RED },
      { t: "MISSING 1, 2, 3 — BLOCKING", c: RED },
    ],
    [{ t: "RECOVERED · HASH IDENTICAL", c: GREEN }],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 110 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {headline.map((line, i) => {
          const s = snap(frame, fps, i * 9);
          return (
            <Dot key={i} size={i === 2 ? 86 : 66} color={i === 2 ? RED : "#fafafa"} style={{ opacity: s, transform: `translateX(${(1 - s) * -90}px)` }}>
              {line}
            </Dot>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 150, bottom: 150, display: "flex", alignItems: "flex-end", gap: 56 }}>
        {["BASELINE", "REDESIGN", "HEALED"].map((label, i) => (
          <div key={label} style={{ textAlign: "center", opacity: stage >= i ? 1 : 0.18 }}>
            <div style={{ display: "flex", justifyContent: "center", height: 330, alignItems: "flex-end" }}>
              <SegBar width={140} height={330} color={i === 1 ? RED : i === 2 ? GREEN : "#fafafa"} grow={barGrow[i]} />
            </div>
            <div style={{ marginTop: 16 }}>
              <Dot size={20} color={Z5}>{label}</Dot>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 150, display: "flex", flexDirection: "column", gap: 12 }}>
        {chips[stage].map((chip, i) => {
          const s = snap(frame, fps, stage * 80 + i * 5);
          return (
            <div key={`${stage}-${i}`} style={{ opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
              <Dot size={24} color={chip.c}>{chip.t}</Dot>
            </div>
          );
        })}
        {stage === 2 && (
          <span style={{ fontFamily: sans, fontSize: 22, color: Z5, marginTop: 12 }}>
            A naive dashboard: &ldquo;NimbusDesk disappeared.&rdquo; Magpie blocked it.
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 4 · RUN TIMELINE (560-790) ---------- */
function RUNS_DATA() {
  const rows = [1, 10, 0, 0, 7, 10, 0, 10, 10];
  const colors = [Z5, GREEN, "#7f1d1d", "#7f1d1d", RED, GREEN, "#7f1d1d", GREEN, "#a78bfa"];
  return rows.map((rows_, i) => ({ rows: rows_, color: colors[i], n: i + 1 }));
}

function SceneTimeline() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const runs = RUNS_DATA();
  const title = snap(frame, fps, 2);
  const distIn = snap(frame, fps, 120);
  const ann1 = snap(frame, fps, 140);
  const ann2 = snap(frame, fps, 155);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 100 }}>
      <div style={{ opacity: title, marginBottom: 30 }}>
        <Dot size={40} color="#fafafa">
          NINE GENUINE RUNS · ONE COLLECTOR · <span style={{ color: RED }}>A CHANGING SOURCE</span>
        </Dot>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 420 }}>
        {runs.map((run, i) => {
          const grow = interpolate(spring({ frame: frame - 20 - i * 6, fps, config: { damping: 15 } }), [0, 1], [0, Math.max(run.rows, 0.6) / 10]);
          return (
            <div key={run.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 12, height: "100%" }}>
              <span style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: Z3 }}>{run.rows}</span>
              <div style={{ width: "72%", height: 340, display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${grow * 100}%`,
                    background: `repeating-linear-gradient(180deg, ${run.color} 0 8px, transparent 8px 12px)`,
                    borderRadius: 2,
                  }}
                />
              </div>
              <Dot size={17} color={Z5}>{String(run.n).padStart(2, "0")}</Dot>
            </div>
          );
        })}
      </div>
      {/* annotations */}
      <div style={{ position: "absolute", top: 210, left: "48%", opacity: ann1 }}>
        <Dot size={20} color={RED}>↑ 05 — THE LIE: 7 ROWS, SCHEMA-VALID</Dot>
      </div>
      <div style={{ position: "absolute", top: 240, left: "72%", opacity: ann2 }}>
        <Dot size={20} color={RED}>↑ 07 — CAUGHT OVERFIT REPAIR</Dot>
      </div>
      {/* verdict distribution */}
      <div style={{ marginTop: 46, opacity: distIn }}>
        <div style={{ display: "flex", height: 44, borderRadius: 3, border: `2px solid ${LINE}`, overflow: "hidden" }}>
          {[
            { w: 44, c: GREEN, t: "4" },
            { w: 44, c: RED, t: "4" },
            { w: 12, c: "#3f3f46", t: "" },
          ].map((seg, i) => (
            <div key={i} style={{ width: `${seg.w}%`, background: seg.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {seg.t && <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: "#000" }}>{seg.t}</span>}
            </div>
          ))}
        </div>
        <p style={{ fontFamily: sans, fontSize: 22, color: Z5, marginTop: 16 }}>
          <span style={{ color: GREEN }}>4 published</span> · <span style={{ color: RED }}>4 blocked before reaching a customer</span> · 1 diagnostic
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 5 · THE HEAL (790-1000) ---------- */
function SceneHeal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    "TRUST ENGINE QUARANTINES THE RUN",
    "DIAGNOSIS: PAGE HAS 10 VENDORS — COLLECTOR MISSED 3",
    "BRIGHT DATA SELF-HEALING PROPOSES A REPAIR",
    "HUMAN REVIEWS THE DIFF — AND APPROVES",
    "SAME COLLECTOR ID RERUNS THE CHANGED PAGE",
    "VERIFIED — SCHEMA UNCHANGED · FACTS HASH IDENTICAL",
  ];
  const lineH = interpolate(frame, [10, 70], [0, 520], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 100 }}>
      <div style={{ marginBottom: 36 }}>
        <Dot size={44} color="#fafafa">
          THE REPAIR — <span style={{ color: RED }}>HUMAN-GATED</span> SELF-HEALING
        </Dot>
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ position: "relative", width: 8 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 8, height: lineH, background: RED, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
          {steps.map((step, i) => {
            const s = snap(frame, fps, 14 + i * 10);
            const isHuman = i === 3;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${(1 - s) * -70}px)` }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 4,
                    border: `2px solid ${isHuman ? RED : LINE}`,
                    background: isHuman ? `${RED}26` : INK,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: isHuman ? RED : Z4 }}>{i + 1}</span>
                </div>
                <Dot size={i === 5 ? 32 : 27} color={i === 5 ? GREEN : isHuman ? RED : "#e4e4e7"}>{step}</Dot>
                {isHuman && (
                  <div style={{ background: RED, borderRadius: 3, padding: "8px 16px" }}>
                    <Dot size={19} color="#fff">HUMAN APPROVAL</Dot>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 24, opacity: snap(frame, fps, 90) }}>
            <div>
              <Dot size={18} color={Z5}>ROWS RESTORED</Dot>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                <span style={{ fontFamily: mono, fontSize: 58, fontWeight: 700, color: RED }}>7</span>
                <span style={{ fontFamily: mono, fontSize: 34, color: Z5 }}>→</span>
                <Count from={7} to={10} size={58} color={GREEN} delay={95} />
              </div>
            </div>
            <div>
              <Dot size={18} color={Z5}>DOWNSTREAM CHANGES</Dot>
              <div style={{ marginTop: 4 }}>
                <Count from={12} to={0} size={58} color={GREEN} delay={95} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 6 · PRODUCT (1000-1260) ---------- */
function SceneProduct() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = snap(frame, fps, 4);
  const b = snap(frame, fps, 22);
  const live = 0.5 + 0.5 * Math.sin(frame / 5);
  const vendors = [
    { name: "AtlasSupport", rank: 1, you: false },
    { name: "NimbusDesk — YOU", rank: 2, you: true },
    { name: "HelioSupport", rank: 3, you: false },
    { name: "ResolveHub", rank: 4, you: false },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 90 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 40 }}>
        <Dot size={42} color="#fafafa">ONE SENSOR. TWO CONSOLES.</Dot>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: `2px solid ${RED}`, borderRadius: 3, padding: "8px 18px" }}>
          <div style={{ width: 13, height: 13, borderRadius: 99, background: RED, opacity: live }} />
          <Dot size={20} color={RED}>LIVE</Dot>
        </div>
      </div>
      <div style={{ display: "flex", gap: 44 }}>
        {/* business card */}
        <div style={{ flex: 1, opacity: a, transform: `translateY(${(1 - a) * 110}px)`, background: INK, border: `2px solid ${LINE}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ borderBottom: `2px solid ${LINE}`, padding: "18px 24px", display: "flex", justifyContent: "space-between" }}>
            <Dot size={20} color={Z4}>BUSINESS · VERIFIED POSITION #2</Dot>
            <div style={{ width: 12, height: 12, borderRadius: 99, background: RED }} />
          </div>
          <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
            {vendors.map((v, i) => {
              const g = interpolate(spring({ frame: frame - 30 - i * 7, fps, config: { damping: 15 } }), [0, 1], [0, 1 - (v.rank - 1) * 0.18]);
              return (
                <div key={v.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontFamily: sans, fontSize: 24, fontWeight: v.you ? 700 : 500, color: v.you ? "#fff" : Z3 }}>{v.name}</span>
                    <span style={{ fontFamily: mono, fontSize: 22, color: Z5 }}>#{v.rank}</span>
                  </div>
                  <div style={{ height: 16, background: SURFACE, borderRadius: 2 }}>
                    <SegBar width={780} height={16} color={v.you ? RED : "#52525b"} grow={g} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* admin card */}
        <div style={{ flex: 1, opacity: b, transform: `translateY(${(1 - b) * 110}px)`, background: INK, border: `2px solid ${LINE}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ borderBottom: `2px solid ${LINE}`, padding: "18px 24px", display: "flex", justifyContent: "space-between" }}>
            <Dot size={20} color={Z4}>ADMIN · NINE GENUINE RUNS</Dot>
            <div style={{ width: 12, height: 12, borderRadius: 99, background: GREEN }} />
          </div>
          <div style={{ padding: "24px 24px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 170 }}>
              {RUNS_DATA().map((run, i) => {
                const g = interpolate(spring({ frame: frame - 50 - i * 4, fps, config: { damping: 15 } }), [0, 1], [0, Math.max(run.rows, 0.6) / 10]);
                return (
                  <div key={run.n} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: `${g * 100}%`, background: `repeating-linear-gradient(180deg, ${run.color} 0 6px, transparent 6px 9px)`, borderRadius: 2 }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
              {["100% EVIDENCE COVERAGE", "3 SELF-HEALS", "2 HUMAN APPROVALS", "0 FALSE REPORTS SHIPPED"].map((chip, i) => (
                <div key={chip} style={{ border: `2px solid ${LINE}`, borderRadius: 3, padding: "8px 14px", opacity: snap(frame, fps, 90 + i * 6) }}>
                  <Dot size={17} color={Z3}>{chip}</Dot>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 7 · CLOSE (1260-1500) ---------- */
function SceneClose() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = snap(frame, fps, 4);
  const l2 = interpolate(frame, [36, 64], [0, 1], { extrapolateRight: "clamp" });
  const l3 = interpolate(frame, [64, 92], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <svg viewBox="0 0 200 200" style={{ width: 230, height: 230, marginBottom: 44, opacity: l1 }}>
        <Bird x={100} y={150} scale={0.85} />
      </svg>
      <Dot size={58} color="#fafafa" style={{ opacity: l1, textAlign: "center", lineHeight: 1.5, transform: `translateY(${(1 - l1) * 30}px)` }}>
        BRIGHT DATA COLLECTORS AS
        <br />
        TRUSTED B2B MARKET SENSORS<span style={{ color: RED }}>.</span>
      </Dot>
      <div style={{ marginTop: 46, opacity: l2 }}>
        <Dot size={23} color={Z4}>
          BUILT WITH BRIGHT DATA SCRAPER STUDIO · SELF-HEALING · HUMAN-GATED
        </Dot>
      </div>
      <div style={{ marginTop: 18, opacity: l3 }}>
        <span style={{ fontFamily: sans, fontSize: 26, color: Z5 }}>
          github.com/vn-envy/magpie · magpie-lab.netlify.app
        </span>
      </div>
    </AbsoluteFill>
  );
}

export const Launch = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={100}>
      <>
        <Wipe />
        <SceneLogo />
      </>
    </Sequence>
    <Sequence from={100} durationInFrames={210}>
      <>
        <Wipe />
        <SceneMirror />
      </>
    </Sequence>
    <Sequence from={310} durationInFrames={250}>
      <>
        <Wipe />
        <SceneLie />
      </>
    </Sequence>
    <Sequence from={560} durationInFrames={230}>
      <>
        <Wipe />
        <SceneTimeline />
      </>
    </Sequence>
    <Sequence from={790} durationInFrames={210}>
      <>
        <Wipe />
        <SceneHeal />
      </>
    </Sequence>
    <Sequence from={1000} durationInFrames={260}>
      <>
        <Wipe />
        <SceneProduct />
      </>
    </Sequence>
    <Sequence from={1260} durationInFrames={240}>
      <SceneClose />
    </Sequence>
  </AbsoluteFill>
);
