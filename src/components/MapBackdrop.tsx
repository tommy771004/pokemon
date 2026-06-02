/**
 * MapBackdrop — an original, stylized cartographic backdrop for the Exploration
 * Map page.
 *
 * This is deliberately a hand-drawn, schematic landmass (editorial / fictional),
 * NOT a reproduction or trace of any in-game map art. It only conveys the rough
 * spatial relationship between regions so the location pins have geographic
 * context. Coordinates use a 0–100 viewBox with preserveAspectRatio="none" so
 * they line up with the pin x/y percentages used in Map.tsx.
 *
 * Layout intent (interpretive — Pokopia has no published coordinate map):
 *   NW arid wasteland · W/SW coast · central volcanic ridges · floating sky
 *   islands to the north · SE endgame town ringed by three legendary peaks ·
 *   offshore dream isles to the east.
 */
const LAND =
  "M16,34 C14,22 24,16 36,18 C46,12 58,14 64,22 C76,22 86,30 84,44 C88,56 86,70 78,78 C70,88 54,88 44,84 C30,86 18,80 16,68 C8,62 8,46 16,34 Z";

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
          <path d={LAND} />
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
        d={LAND}
        fill="var(--color-paper-warm)"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.4"
        opacity="0.92"
      />

      {/* Soft biome tints, clipped to land. */}
      <g clipPath="url(#pokopia-land)">
        {/* NW arid wasteland */}
        <ellipse cx="24" cy="30" rx="16" ry="14" fill="var(--color-tertiary)" opacity="0.16" />
        {/* Central volcanic ridges */}
        <ellipse cx="48" cy="44" rx="17" ry="15" fill="var(--color-primary)" opacity="0.14" />
        {/* SW coastal beach */}
        <ellipse cx="16" cy="62" rx="14" ry="13" fill="var(--color-secondary)" opacity="0.18" />
        {/* SE endgame town basin */}
        <ellipse cx="71" cy="70" rx="14" ry="13" fill="var(--color-secondary)" opacity="0.13" />
        {/* Eastern legendary-peak highlands ringing the town */}
        <ellipse cx="73" cy="62" rx="15" ry="16" fill="var(--color-primary)" opacity="0.09" />
      </g>

      {/* Floating sky islands (Sparkling Skylands / Huge Building) — detached above land. */}
      <g opacity="0.9">
        <ellipse cx="50" cy="11" rx="9" ry="3.4" fill="var(--color-bone)" stroke="var(--color-ink-mute)" strokeWidth="0.35" />
        <ellipse cx="50" cy="11" rx="9" ry="3.4" fill="var(--color-tertiary)" opacity="0.12" />
        <ellipse cx="60" cy="7" rx="6" ry="2.6" fill="var(--color-bone)" stroke="var(--color-ink-mute)" strokeWidth="0.35" />
        <ellipse cx="60" cy="7" rx="6" ry="2.6" fill="var(--color-tertiary)" opacity="0.12" />
      </g>

      {/* Offshore dream isles (east). */}
      <g fill="var(--color-paper-warm)" stroke="var(--color-ink-mute)" strokeWidth="0.3" opacity="0.85">
        <ellipse cx="90" cy="42" rx="4.6" ry="3.1" />
        <ellipse cx="95" cy="47" rx="2.4" ry="1.8" />
      </g>

      {/* Mountain glyphs — central ridge + the three legendary peaks around the town. */}
      <g stroke="var(--color-ink-mute)" strokeWidth="0.45" fill="none" opacity="0.55" strokeLinejoin="round">
        <polyline points="43,45 46,40 49,45" />
        <polyline points="48,46 52,39 56,46" />
        <polyline points="57,61 60,56 63,61" />
        <polyline points="77,59 80,54 83,59" />
        <polyline points="71,83 74,78 77,83" />
      </g>

      {/* Suggested main progression route (story order), dashed and subtle. */}
      <path
        d="M22,30 L13,60 L48,44 L50,11 L70,70"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.35"
      />

      {/* Compass rose. */}
      <g transform="translate(91,11)" opacity="0.5">
        <circle r="3.4" fill="none" stroke="var(--color-ink-mute)" strokeWidth="0.3" />
        <path d="M0,-3.2 L1,0 L0,3.2 L-1,0 Z" fill="var(--color-primary)" opacity="0.7" />
        <text x="0" y="-4.1" textAnchor="middle" fontSize="2.4" fill="var(--color-ink-mute)">N</text>
      </g>
    </svg>
  );
}
