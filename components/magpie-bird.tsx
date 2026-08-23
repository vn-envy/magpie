// Nothing-glyph-inspired magpie: black-and-white geometry, red eye,
// sequentially lighting wing dots, a collected "shiny" spark, gentle float.
// Pure SVG + CSS so it animates everywhere with zero JS.
export function MagpieBird({ size = 120 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Animated magpie logo"
      className="magpie"
    >
      {/* perch */}
      <line x1="18" y1="104" x2="102" y2="104" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />

      {/* legs */}
      <line x1="55" y1="88" x2="55" y2="104" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="67" y1="88" x2="67" y2="104" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" />

      {/* tail — flicks */}
      <g className="magpie-tail">
        <polygon points="38,62 8,44 16,58 6,60 34,72" fill="#18181b" />
      </g>

      {/* body */}
      <g className="magpie-body">
        <ellipse cx="58" cy="66" rx="24" ry="20" fill="#18181b" />
        {/* white flank */}
        <path d="M44 62 Q58 84 74 68 Q66 82 52 80 Q42 74 44 62 Z" fill="#fafafa" />
        {/* head */}
        <circle cx="78" cy="44" r="13" fill="#18181b" />
        {/* beak */}
        <polygon points="90,42 104,46 90,50" fill="#a1a1aa" />
        {/* eye — blinks red */}
        <circle cx="81" cy="41" r="3" fill="#D71921" className="magpie-eye" />
        {/* wing */}
        <path d="M42 60 Q58 50 74 60 Q58 66 42 60 Z" fill="#000" stroke="#3f3f46" strokeWidth="1" />
        {/* wing glyph dots — light in sequence */}
        <circle cx="50" cy="58" r="2" fill="#fafafa" className="glyph g1" />
        <circle cx="58" cy="56" r="2" fill="#fafafa" className="glyph g2" />
        <circle cx="66" cy="58" r="2" fill="#fafafa" className="glyph g3" />
      </g>

      {/* collected shiny citation */}
      <g className="magpie-spark">
        <polygon points="106,36 109,42 115,45 109,48 106,54 103,48 97,45 103,42" fill="#D71921" />
      </g>
    </svg>
  );
}
