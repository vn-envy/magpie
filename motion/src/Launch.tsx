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

const RED = "#D71921";
const INK = "#0a0b0c";
const SURFACE = "#111315";
const LINE = "#222222";
const Z4 = "#a1a1aa";
const Z5 = "#71717a";

// Motion personality: precise/technical — spring entrances, staggered
// choreography, mechanical wipes, one deliberate red emphasis beat per scene.

function useSpringIn(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 120 } });
}

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
        letterSpacing: "0.12em",
        ...style,
      }}
    >
      {children}
    </span>
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
            ? 0.35 + 0.65 * Math.abs(Math.sin(flickerFrame / 5))
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
      <path
        d="M-44 -76 Q0 -8 52 -48 Q24 8 -24 0 -52 -20 -44 -76 Z"
        fill="#fafafa"
        opacity={0.92}
      />
      <circle cx={60} cy={-124} r={38} fill="#18181b" />
      <polygon points="94,-132 136,-120 94,-108" fill={Z4} />
      <circle cx={66} cy={-130} r={9} fill={RED} />
      <path d="M-40 -84 Q0 -112 44 -84 Q0 -64 -40 -84 Z" fill="#000" stroke={LINE} strokeWidth={2} />
    </g>
  );
}

/* ---------- SCENE 1 · LOGO (0-140) ---------- */
function SceneLogo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = "MAGPIE.".split("");
  const subIn = interpolate(frame, [55, 85], [0, 1], { extrapolateRight: "clamp" });
  const scanX = interpolate(frame, [0, 60], [-400, 2400], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 240, left: scanX, width: 6, height: 600, background: RED, opacity: 0.5 }} />
      <div style={{ display: "flex" }}>
        {word.map((letter, i) => {
          const s = spring({ frame: frame - 8 - i * 4, fps, config: { damping: 12, stiffness: 160 } });
          return (
            <Dot key={i} size={150} color={letter === "." ? RED : "#fafafa"} style={{ opacity: Math.min(1, s), transform: `translateY(${(1 - s) * 60}px)` }}>
              {letter}
            </Dot>
          );
        })}
      </div>
      <div style={{ marginTop: 30, opacity: subIn, transform: `translateY(${(1 - subIn) * 14}px)` }}>
        <Dot size={26} color={Z4}>
          EVIDENCE INTELLIGENCE FOR B2B GEO
        </Dot>
      </div>
      <div style={{ position: "absolute", bottom: 140, opacity: subIn * 0.7 }}>
        <span style={{ fontFamily: sans, fontSize: 24, color: Z5 }}>
          It knows a reflection from the real thing.
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 2 · MIRROR TEST (140-380) ---------- */
function SceneMirror() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameDraw = interpolate(frame, [0, 45], [1, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const birdIn = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const reflectIn = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: "clamp" });
  const glitch = frame > 120;
  const scan = interpolate(frame, [150, 185], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const stamp = spring({ frame: frame - 195, fps, config: { damping: 9, stiffness: 200 } });
  const caption = [110, 130, 195, 215].map((d) => frame >= d);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <line x1={140} y1={940} x2={1780} y2={940} stroke={LINE} strokeWidth={4} />
        {/* mirror */}
        <rect
          x={1060}
          y={260}
          width={700}
          height={560}
          rx={8}
          fill="#0d0d0d"
          stroke="#52525b"
          strokeWidth={7}
          strokeDasharray={3200}
          strokeDashoffset={3200 * frameDraw}
        />
        {/* real bird */}
        <g opacity={birdIn} transform={`translate(${(1 - birdIn) * -260}, 0)`}>
          <Bird x={620} y={880} scale={1.6} missingDots={0} />
        </g>
        {/* reflection */}
        <g opacity={reflectIn * (glitch ? 0.95 : 1)}>
          <g transform={`translate(1760, 880) scale(-1.6, 1.6)`}>
            <Bird x={0} y={0} scale={1} missingDots={glitch ? 3 : 0} flickerFrame={frame} opacity={0.75} />
          </g>
        </g>
        {/* scan line */}
        {frame >= 150 && frame <= 200 && (
          <line x1={1080 + scan * 640} y1={280} x2={1080 + scan * 640} y2={800} stroke={RED} strokeWidth={5} />
        )}
        {/* stamp */}
        {frame >= 195 && (
          <g transform={`translate(1410, 380) scale(${Math.max(0.001, stamp)})`} opacity={Math.min(1, stamp)}>
            <rect x={-190} y={-44} width={380} height={88} rx={6} fill="none" stroke={RED} strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fill={RED} fontSize={40} fontFamily={dot} letterSpacing={6}>
              7/10 — NOT REAL
            </text>
          </g>
        )}
      </svg>
      {/* captions */}
      <div style={{ position: "absolute", bottom: 120, width: "100%", textAlign: "center" }}>
        <Dot size={34} color={caption[3] ? RED : Z4}>
          {caption[3]
            ? "YOUR DASHBOARD IS A REFLECTION. MAGPIE KNOWS WHEN IT LIES."
            : caption[2]
              ? "THE MAGPIE KNOWS — IT PASSES THE MIRROR TEST"
              : caption[0]
                ? "BUT THREE OF ITS TEN DOTS ARE MISSING"
                : "A MAGPIE MEETS A MIRROR"}
        </Dot>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 3 · THE LIE (380-640) ---------- */
function SceneLie() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = ["RUN SUCCEEDED.", "JSON VALID.", "BUSINESS CONCLUSION WRONG."];
  const phase = frame < 90 ? 0 : frame < 180 ? 1 : 2; // 10 → 7 → 10
  const barHeights = [10, 7, 10];
  const barColor = ["#fafafa", RED, "#22c55e"];
  const labels = [
    [{ t: "10/10 ROWS · TRUSTED", c: Z4 }],
    [
      { t: "RATIO 70% — BLOCKING", c: RED },
      { t: "MIN RANK 4 — BLOCKING", c: RED },
      { t: "MISSING 1,2,3 — BLOCKING", c: RED },
    ],
    [{ t: "7 → 10 RECOVERED · HASH IDENTICAL", c: "#22c55e" }],
  ];
  const checkIn = spring({ frame: frame - 200, fps });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 120 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {headline.map((line, i) => {
          const s = spring({ frame: frame - i * 12, fps, config: { damping: 13 } });
          return (
            <Dot key={i} size={i === 2 ? 84 : 64} color={i === 2 ? RED : "#fafafa"} style={{ opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}>
              {line}
            </Dot>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 160, bottom: 140, display: "flex", alignItems: "flex-end", gap: 60 }}>
        {[0, 1, 2].map((i) => {
          const active = phase >= i;
          const h = interpolate(frame, [i * 90, i * 90 + 25], [0, barHeights[i] * 46], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div key={i} style={{ textAlign: "center", opacity: active ? 1 : 0.15 }}>
              <div style={{ width: 130, height: h, background: barColor[i], borderRadius: 2 }} />
              <div style={{ marginTop: 14 }}>
                <Dot size={20} color={Z5}>{["BASELINE", "REDESIGN", "HEALED"][i]}</Dot>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 140, display: "flex", flexDirection: "column", gap: 12 }}>
        {labels[phase].map((l, i) => (
          <Dot key={`${phase}-${i}`} size={22} color={l.c} style={{ opacity: phase === 2 ? checkIn : 1 }}>
            {l.t}
          </Dot>
        ))}
        <span style={{ fontFamily: sans, fontSize: 20, color: Z5, marginTop: 10, opacity: checkIn }}>
          A naive dashboard would report: &ldquo;NimbusDesk disappeared.&rdquo; Magpie blocked it.
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 4 · THE HEAL (640-880) ---------- */
function SceneHeal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    "TRUST ENGINE QUARANTINES THE RUN",
    "DIAGNOSIS: PAGE HAS 10 VENDORS — COLLECTOR MISSED 3",
    "BRIGHT DATA SELF-HEALING PROPOSES A REPAIR",
    "HUMAN REVIEWS THE DIFF — AND APPROVES",
    "SAME COLLECTOR ID RERUNS THE CHANGED PAGE",
    "VERIFIED: SCHEMA UNCHANGED · FACTS HASH IDENTICAL",
    "0 DOWNSTREAM CHANGES",
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 120, justifyContent: "center" }}>
      <div style={{ marginBottom: 50 }}>
        <Dot size={44} color="#fafafa">
          THE REPAIR — <span style={{ color: RED }}>HUMAN-GATED</span> SELF-HEALING
        </Dot>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((step, i) => {
          const s = spring({ frame: frame - 10 - i * 11, fps, config: { damping: 15 } });
          const isHuman = i === 3;
          const isFinal = i === 6;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 4,
                  border: `2px solid ${isHuman ? RED : LINE}`,
                  background: isHuman ? `${RED}22` : INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Dot size={22} color={isHuman ? RED : Z4}>{String(i + 1)}</Dot>
              </div>
              <Dot size={isFinal ? 32 : 26} color={isFinal ? "#22c55e" : isHuman ? RED : "#e4e4e7"}>
                {step}
              </Dot>
              {isHuman && (
                <div style={{ background: RED, color: "#fff", borderRadius: 3, padding: "6px 14px" }}>
                  <Dot size={18} color="#fff">HUMAN APPROVAL</Dot>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 5 · PRODUCT (880-1140) ---------- */
function SceneProduct() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardA = spring({ frame: frame - 5, fps, config: { damping: 15 } });
  const cardB = spring({ frame: frame - 45, fps, config: { damping: 15 } });
  const card = (title: string, rows: string[], accent: string) => (
    <div style={{ flex: 1, background: INK, border: `2px solid ${LINE}`, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ borderBottom: `2px solid ${LINE}`, padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Dot size={20} color={Z4}>{title}</Dot>
        <div style={{ width: 12, height: 12, borderRadius: 99, background: accent }} />
      </div>
      <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: sans, fontSize: 22, color: "#d4d4d8" }}>{row}</span>
            <div style={{ width: 90, height: 10, background: SURFACE, borderRadius: 2 }}>
              <div style={{ width: `${100 - i * 18}%`, height: "100%", background: i === 0 ? accent : Z5, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const live = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: 110, justifyContent: "center" }}>
      <div style={{ marginBottom: 44, display: "flex", alignItems: "center", gap: 24 }}>
        <Dot size={40} color="#fafafa">ONE SENSOR. TWO CONSOLES.</Dot>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: `2px solid ${RED}`, borderRadius: 3, padding: "8px 16px" }}>
          <div style={{ width: 12, height: 12, borderRadius: 99, background: RED, opacity: live }} />
          <Dot size={18} color={RED}>LIVE</Dot>
        </div>
      </div>
      <div style={{ display: "flex", gap: 44 }}>
        <div style={{ flex: 1, opacity: cardA, transform: `translateY(${(1 - cardA) * 90}px)` }}>
          {card("BUSINESS — VERIFIED POSITION #2", ["AtlasSupport", "NimbusDesk — YOU", "HelioSupport", "ResolveHub", "+ 6 more verified"], RED)}
        </div>
        <div style={{ flex: 1, opacity: cardB, transform: `translateY(${(1 - cardB) * 90}px)` }}>
          {card("ADMIN — 9 GENUINE RUNS", ["TRUSTED × 4", "BLOCKED × 3", "TRUSTED CHANGE × 1", "SELF-HEALS × 3", "HUMAN APPROVALS × 2"], "#22c55e")}
        </div>
      </div>
      <div style={{ marginTop: 44, opacity: cardB }}>
        <span style={{ fontFamily: sans, fontSize: 26, color: Z5 }}>
          Trigger a genuine Bright Data collection from the dashboard — verdict computed on arrival.
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- SCENE 6 · CLOSE (1140-1350) ---------- */
function SceneClose() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line1 = spring({ frame: frame - 5, fps, config: { damping: 13 } });
  const line2 = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const line3 = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <svg viewBox="0 0 200 200" style={{ width: 220, height: 220, marginBottom: 40, opacity: line1 }}>
        <Bird x={100} y={150} scale={0.9} />
      </svg>
      <Dot size={56} color="#fafafa" style={{ opacity: line1, transform: `translateY(${(1 - line1) * 30}px)`, textAlign: "center", lineHeight: 1.5 }}>
        BRIGHT DATA COLLECTORS AS
        <br />
        TRUSTED B2B MARKET SENSORS<span style={{ color: RED }}>.</span>
      </Dot>
      <div style={{ marginTop: 44, opacity: line2 }}>
        <Dot size={22} color={Z4}>
          BUILT WITH BRIGHT DATA SCRAPER STUDIO · SELF-HEALING · HUMAN-GATED
        </Dot>
      </div>
      <div style={{ marginTop: 18, opacity: line3 }}>
        <span style={{ fontFamily: sans, fontSize: 24, color: Z5 }}>github.com/vn-envy/magpie · magpie-lab.netlify.app</span>
      </div>
    </AbsoluteFill>
  );
}

export const Launch = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={140}>
      <SceneLogo />
    </Sequence>
    <Sequence from={140} durationInFrames={240}>
      <SceneMirror />
    </Sequence>
    <Sequence from={380} durationInFrames={260}>
      <SceneLie />
    </Sequence>
    <Sequence from={640} durationInFrames={240}>
      <SceneHeal />
    </Sequence>
    <Sequence from={880} durationInFrames={260}>
      <SceneProduct />
    </Sequence>
    <Sequence from={1140}>
      <SceneClose />
    </Sequence>
  </AbsoluteFill>
);
