import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSilkscreen } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const dot = loadSilkscreen().fontFamily;
const sans = loadInter().fontFamily;
const mono = "SF Mono, Menlo, monospace";

const RED = "#D71921";
const GREEN = "#22c55e";
const Z4 = "#a1a1aa";
const Z5 = "#71717a";

const FPS = 30;
const GAP = 18;

// VO section lengths in seconds (generated with macOS Samantha @192wpm)
const SECTIONS = [
  { id: "s1", sec: 11.32 },
  { id: "s2", sec: 11.32 },
  { id: "s3", sec: 19.56 },
  { id: "s4", sec: 19.54 },
  { id: "s5", sec: 17.09 },
  { id: "s6", sec: 12.96 },
  { id: "s7", sec: 12.44 },
  { id: "s8", sec: 12.39 },
].map((s) => ({ ...s, frames: Math.ceil(s.sec * FPS) }));

export const SECTION_OFFSETS = SECTIONS.map((_, i) =>
  SECTIONS.slice(0, i).reduce((sum, s) => sum + s.frames + GAP, 0),
);

export const DEMO_DURATION =
  SECTION_OFFSETS[SECTION_OFFSETS.length - 1] + SECTIONS[SECTIONS.length - 1].frames + 75;

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
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Bird({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={i * 26} cy={-92} r={6.5} fill="#fafafa" />
      ))}
      <line x1={0} y1={0} x2={0} y2={52} stroke={Z5} strokeWidth={6} strokeLinecap="round" />
      <line x1={48} y1={0} x2={48} y2={52} stroke={Z5} strokeWidth={6} strokeLinecap="round" />
      <polygon points="-84,-40 -152,-80 -132,-48 -160,-44 -76,-16" fill="#18181b" />
      <ellipse cx={0} cy={-64} rx={72} ry={60} fill="#18181b" />
      <path d="M-44 -76 Q0 -8 52 -48 Q24 8 -24 0 -52 -20 -44 -76 Z" fill="#fafafa" opacity={0.92} />
      <circle cx={60} cy={-124} r={38} fill="#18181b" />
      <polygon points="94,-132 136,-120 94,-108" fill={Z4} />
      <circle cx={66} cy={-130} r={9} fill={RED} />
      <path d="M-40 -84 Q0 -112 44 -84 Q0 -64 -40 -84 Z" fill="#000" stroke="#222" strokeWidth={2} />
    </g>
  );
}

/* Full-bleed product screenshot with a slow zoom (transform only). */
function Shot({ name, caption }: { name: string; caption: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(frame, [0, fps * 6], [1.0, 1.045], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const capIn = snap(frame, fps, 8);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile(`shots/${name}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
        />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: "linear-gradient(transparent, rgba(0,0,0,0.92))" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 64,
          opacity: capIn,
          transform: `translateY(${(1 - capIn) * 14}px)`,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span style={{ width: 10, height: 44, background: RED, borderRadius: 2 }} />
        <Dot size={30}>{caption}</Dot>
      </div>
    </AbsoluteFill>
  );
}

/* Multi-shot section: divides its duration evenly across shots. */
function Shots({ names, captions }: { names: string[]; captions: string[] }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const per = durationInFrames / names.length;
  const index = Math.min(names.length - 1, Math.floor(frame / per));
  return <Shot name={names[index]} caption={captions[index]} />;
}

/* ---------- S1 · HOOK ---------- */
function Hook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = snap(frame, fps, 10);
  const l2 = snap(frame, fps, 70);
  const l3 = snap(frame, fps, 150);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ opacity: l1, transform: `translateY(${(1 - l1) * 26}px)` }}>
          <Dot size={58}>AGENTS + SCRAPERS</Dot>
        </div>
        <div style={{ marginTop: 14, opacity: l1, transform: `translateY(${(1 - l1) * 26}px)` }}>
          <Dot size={58}>FEED YOUR GEO DECISIONS</Dot>
        </div>
        <div style={{ marginTop: 60, opacity: l2, transform: `translateY(${(1 - l2) * 26}px)` }}>
          <Dot size={44} color={RED}>WHEN THE SCRAPER LIES…</Dot>
        </div>
        <div style={{ marginTop: 14, opacity: l3, transform: `translateY(${(1 - l3) * 26}px)` }}>
          <Dot size={38} color={Z4}>PERFECT JSON. YOUR COMPETITORS — MISSING.</Dot>
        </div>
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 12, opacity: l3 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 2,
                background: i >= 7 ? "transparent" : "#fafafa",
                border: i >= 7 ? `3px solid ${RED}` : "none",
                opacity: i >= 7 ? pulse : 1,
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- S2 · MIRROR ---------- */
function Mirror() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameDraw = interpolate(frame, [5, 40], [1, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const birdIn = snap(frame, fps, 15);
  const reflectIn = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const glitch = frame > 95;
  const scan = interpolate(frame, [115, 145], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const stampS = snap(frame, fps, 150);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <line x1={140} y1={940} x2={1780} y2={940} stroke="#222" strokeWidth={4} />
        <rect x={1060} y={250} width={700} height={570} rx={8} fill="#0d0d0d" stroke="#52525b" strokeWidth={7} strokeDasharray={3200} strokeDashoffset={3200 * frameDraw} />
        <g opacity={birdIn} transform={`translate(${(1 - birdIn) * -280}, 0)`}>
          <Bird x={600} y={880} scale={1.55} />
        </g>
        <g opacity={reflectIn}>
          <g transform="translate(1760, 880) scale(-1.55, 1.55)">
            <g opacity={0.75}>
              {Array.from({ length: 10 }).map((_, i) => {
                const missing = glitch && i >= 7;
                return (
                  <circle key={i} cx={i * 26} cy={-92} r={6.5} fill={missing ? "none" : "#fafafa"} stroke={missing ? RED : "none"} strokeWidth={3} opacity={missing ? 0.35 + 0.65 * Math.abs(Math.sin(frame / 4)) : 1} />
                );
              })}
              <ellipse cx={0} cy={-64} rx={72} ry={60} fill="#27272a" />
              <circle cx={60} cy={-124} r={38} fill="#27272a" />
            </g>
          </g>
        </g>
        {frame >= 115 && frame <= 155 && (
          <line x1={1080 + scan * 640} y1={270} x2={1080 + scan * 640} y2={800} stroke={RED} strokeWidth={5} />
        )}
        {frame >= 150 && (
          <g transform={`translate(1410, 330) scale(${Math.max(0.001, stampS)})`} opacity={Math.min(1, stampS * 1.3)}>
            <rect x={-230} y={-46} width={460} height={92} rx={6} fill="none" stroke={RED} strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fill={RED} fontSize={44} fontFamily={mono} letterSpacing={5}>7/10 — NOT REAL</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
}

/* ---------- S5 overlay: 7 → 10 ---------- */
function RecoverOverlay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = snap(frame, fps, 180);
  const v = Math.round(interpolate(s, [0, 1], [7, 10]));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, pointerEvents: "none" }}>
      <div style={{ opacity: s, display: "flex", alignItems: "baseline", gap: 22, background: "rgba(0,0,0,0.75)", padding: "26px 54px", border: `3px solid ${GREEN}`, borderRadius: 8 }}>
        <span style={{ fontFamily: mono, fontSize: 84, fontWeight: 700, color: RED }}>7</span>
        <span style={{ fontFamily: mono, fontSize: 52, color: Z4 }}>→</span>
        <span style={{ fontFamily: mono, fontSize: 84, fontWeight: 700, color: GREEN }}>{v}</span>
        <span style={{ marginLeft: 18, fontFamily: dot, fontSize: 22, color: GREEN }}>ROWS · HASH IDENTICAL</span>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- S7 · MONEY ---------- */
function Money() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards = [
    { t1: "1 BROKEN SENSOR", t2: "silently wrong — schema-valid" },
    { t1: "WEEKS OF WASTED CONTENT + PR", t2: "a team redirected on false evidence" },
    { t1: "A STRATEGY PIVOT BUILT ON A BUG", t2: "and nobody traces it back" },
  ];
  const line = snap(frame, fps, 200);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 36 }}>
        {cards.map((card, i) => {
          const s = snap(frame, fps, 20 + i * 55);
          return (
            <div
              key={card.t1}
              style={{
                opacity: s,
                transform: `translateY(${(1 - s) * 40}px) scale(${0.94 + s * 0.06})`,
                width: 480,
                padding: "44px 36px",
                border: `3px solid ${i === 0 ? RED : "#222"}`,
                borderRadius: 8,
                background: "#0a0b0c",
                textAlign: "center",
              }}
            >
              <Dot size={26} color={i === 0 ? RED : "#e4e4e7"}>{card.t1}</Dot>
              <p style={{ marginTop: 18, fontFamily: sans, fontSize: 21, color: Z5 }}>{card.t2}</p>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 80, opacity: line, transform: `translateY(${(1 - line) * 20}px)` }}>
        <Dot size={42} color={GREEN}>TRUST MUST BE VERIFIED — NOT ASSUMED</Dot>
      </div>
      <p style={{ position: "absolute", bottom: 56, fontFamily: mono, fontSize: 17, color: "#52525b" }}>illustrative of the failure mode captured in inc_001</p>
    </AbsoluteFill>
  );
}

/* ---------- S8 · CLOSE ---------- */
function Close() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const showShot = frame < durationInFrames * 0.45;
  const s = showShot ? 0 : snap(frame, fps, Math.floor(durationInFrames * 0.45));
  if (showShot) return <Shot name="11-incident.png" caption="THE FULL AUDIT — EVERY RUN, EVERY HASH" />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <svg viewBox="0 0 200 200" style={{ width: 210, height: 210, marginBottom: 40, opacity: s }}>
        <Bird x={100} y={150} scale={0.82} />
      </svg>
      <Dot size={54} style={{ opacity: s, textAlign: "center", lineHeight: 1.5, transform: `translateY(${(1 - s) * 26}px)` }}>
        BRIGHT DATA COLLECTORS AS
        <br />
        TRUSTED B2B MARKET SENSORS<span style={{ color: RED }}>.</span>
      </Dot>
      <div style={{ marginTop: 42, opacity: s }}>
        <Dot size={22} color={Z4}>BUILT WITH BRIGHT DATA SCRAPER STUDIO · SELF-HEALING · HUMAN-GATED</Dot>
      </div>
      <div style={{ marginTop: 16, opacity: s }}>
        <span style={{ fontFamily: sans, fontSize: 24, color: Z5 }}>github.com/vn-envy/magpie · magpie-lab.netlify.app</span>
      </div>
    </AbsoluteFill>
  );
}

export const Demo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={SECTION_OFFSETS[0]} durationInFrames={SECTIONS[0].frames}>
        <>
          <Hook />
          <Audio src={staticFile("vo/s1.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[1]} durationInFrames={SECTIONS[1].frames}>
        <>
          <Mirror />
          <Audio src={staticFile("vo/s2.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[2]} durationInFrames={SECTIONS[2].frames}>
        <>
          <Shots
            names={["02-enter.png", "03-research.png", "04-landscape.png", "05-plan.png"]}
            captions={["STEP 1 — WHERE DO YOU COMPETE?", "RESEARCHING — REAL BRIGHT DATA COLLECTOR", "VERIFIED LANDSCAPE — #2 OF 10", "YOUR PLAN — EVIDENCE-LINKED"]}
          />
          <Audio src={staticFile("vo/s3.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[3]} durationInFrames={SECTIONS[3].frames}>
        <>
          <Shots
            names={["06-shift.png", "07-deviation.png"]}
            captions={["SOURCE REDESIGNED — CAROUSEL", "7/10 ROWS — SCHEMA-VALID — BLOCKED"]}
          />
          <Audio src={staticFile("vo/s4.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[4]} durationInFrames={SECTIONS[4].frames}>
        <>
          <Shot name="08-resolution.png" caption="HUMAN-APPROVED REPAIR — VERIFIED" />
          <RecoverOverlay />
          <Audio src={staticFile("vo/s5.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[5]} durationInFrames={SECTIONS[5].frames}>
        <>
          <Shots
            names={["09-live.png", "10-admin.png"]}
            captions={["● LIVE — CRON, REAL WEB, REAL COMPETITION", "NINE GENUINE RUNS — HALF BLOCKED"]}
          />
          <Audio src={staticFile("vo/s6.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[6]} durationInFrames={SECTIONS[6].frames}>
        <>
          <Money />
          <Audio src={staticFile("vo/s7.m4a")} />
        </>
      </Sequence>
      <Sequence from={SECTION_OFFSETS[7]} durationInFrames={DEMO_DURATION - SECTION_OFFSETS[7]}>
        <>
          <Close />
          <Audio src={staticFile("vo/s8.m4a")} />
        </>
      </Sequence>
    </AbsoluteFill>
  );
};
