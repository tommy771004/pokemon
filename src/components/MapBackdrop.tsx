/**
 * MapBackdrop — an original, stylized cartographic backdrop for the Exploration
 * Map page.
 *
 * This is deliberately a hand-drawn, schematic landmass (editorial / fictional),
 * NOT a reproduction or trace of any in-game map art. It only conveys the rough
 * spatial relationship between regions so the location pins have geographic
 * context. Coordinates use a 0–100 viewBox with preserveAspectRatio="none" so
 * they line up with the pin x/y percentages used in Map.tsx.
 */
export default function MapBackdrop() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        {/* Clip region tints to the landmass so colour never bleeds into the sea. */}
        <clipPath id="pokopia-land">
          <path d="M14,40 C12,24 26,14 40,16 C50,8 60,10 64,20 C74,18 82,26 80,38 C92,44 90,60 80,64 C84,76 74,86 62,82 C52,92 36,90 30,80 C16,78 8,64 14,52 C10,46 12,42 14,40 Z" />
        </clipPath>
      </defs>

      {/* Sea base + faint cartographic hatch lines. */}
      <rect x="0" y="0" width="100" height="100" fill="var(--color-secondary)" opacity="0.05" />
      <g stroke="var(--color-line-soft)" strokeWidth="0.2" opacity="0.5">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1="0" y1={i * 9 + 4} x2="100" y2={i * 9 + 4} />
        ))}
      </g>

      {/* Main continent. */}
      <path
        d="M14,40 C12,24 26,14 40,16 C50,8 60,10 64,20 C74,18 82,26 80,38 C92,44 90,60 80,64 C84,76 74,86 62,82 C52,92 36,90 30,80 C16,78 8,64 14,52 C10,46 12,42 14,40 Z"
        fill="var(--color-paper-warm)"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.4"
        opacity="0.92"
      />

      {/* Soft biome tints, clipped to land. */}
      <g clipPath="url(#pokopia-land)">
        {/* NW arid wasteland */}
        <ellipse cx="27" cy="24" rx="16" ry="13" fill="var(--color-tertiary)" opacity="0.16" />
        {/* Central volcanic ridges */}
        <ellipse cx="62" cy="36" rx="18" ry="15" fill="var(--color-primary)" opacity="0.14" />
        {/* SW coastal beach */}
        <ellipse cx="22" cy="66" rx="15" ry="13" fill="var(--color-secondary)" opacity="0.18" />
        {/* SE endgame town basin */}
        <ellipse cx="76" cy="70" rx="15" ry="13" fill="var(--color-secondary)" opacity="0.13" />
        {/* Eastern legendary-site highlands */}
        <ellipse cx="80" cy="56" rx="11" ry="12" fill="var(--color-primary)" opacity="0.10" />
      </g>

      {/* Floating sky islands (Sparkling Skylands / Huge Building) — detached above land. */}
      <g opacity="0.9">
        <ellipse cx="50" cy="14" rx="9" ry="3.4" fill="var(--color-bone)" stroke="var(--color-ink-mute)" strokeWidth="0.35" />
        <ellipse cx="50" cy="14" rx="9" ry="3.4" fill="var(--color-tertiary)" opacity="0.12" />
        <ellipse cx="57" cy="8" rx="6" ry="2.6" fill="var(--color-bone)" stroke="var(--color-ink-mute)" strokeWidth="0.35" />
        <ellipse cx="57" cy="8" rx="6" ry="2.6" fill="var(--color-tertiary)" opacity="0.12" />
      </g>

      {/* Offshore dream isles (east). */}
      <g fill="var(--color-paper-warm)" stroke="var(--color-ink-mute)" strokeWidth="0.3" opacity="0.85">
        <ellipse cx="87" cy="44" rx="4.5" ry="3" />
        <ellipse cx="92" cy="49" rx="2.4" ry="1.8" />
        <ellipse cx="89" cy="80" rx="4" ry="3.2" />
      </g>

      {/* Mountain glyphs — central ridge + the three legendary peaks. */}
      <g stroke="var(--color-ink-mute)" strokeWidth="0.45" fill="none" opacity="0.55" strokeLinejoin="round">
        <polyline points="55,32 58,27 61,32" />
        <polyline points="60,33 64,26 68,33" />
        <polyline points="66,57 69,52 72,57" />
        <polyline points="82,60 85,55 88,60" />
        <polyline points="86,80 89,75 92,80" />
      </g>

      {/* Suggested main progression route (story order), dashed and subtle. */}
      <path
        d="M24,24 L18,68 L60,30 L50,14 L78,72"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.35"
      />

      {/* Compass rose. */}
      <g transform="translate(91,12)" opacity="0.5">
        <circle r="3.4" fill="none" stroke="var(--color-ink-mute)" strokeWidth="0.3" />
        <path d="M0,-3.2 L1,0 L0,3.2 L-1,0 Z" fill="var(--color-primary)" opacity="0.7" />
        <text x="0" y="-4.1" textAnchor="middle" fontSize="2.4" fill="var(--color-ink-mute)">N</text>
      </g>
    </svg>
  );
}
