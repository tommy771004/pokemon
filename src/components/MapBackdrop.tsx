import React, { useId } from "react";

/**
 * MapBackdrop — an original, stylized cartographic backdrop for the Exploration
 * Map page and the Local Detail Radar Map.
 *
 * This is deliberately a hand-drawn, schematic landmass (editorial / fictional)
 * representing the island country of Pokopia. Coordinates use a 0–100 viewBox.
 *
 * Custom enhancements include:
 * - Dynamic useId() clipPath isolation to prevent DOM ID collision and alignment
 *   bugs when nesting multiple map instances.
 * - Scholarly grid background (A-J columns, 1-10 rows).
 * - Organic terrain textures (Wave ripples in the ocean, pine tree clusters in the
 *   Empty Town basin, desert sand dunes in the Withered Wasteland, and jagged
 *   volcanic contour fissures in the Bulging Highlands).
 */
const LAND =
  "M16,34 C14,22 24,16 36,18 C46,12 58,14 64,22 C76,22 86,30 84,44 C88,56 86,70 78,78 C70,88 54,88 44,84 C30,86 18,80 16,68 C8,62 8,46 16,34 Z";

interface MapBackdropProps {
  viewBox?: string;
  preserveAspectRatio?: string;
  children?: React.ReactNode;
}

// Wave ripples in the ocean
const WaveGlyph = ({ x, y }: { x: number; y: number }) => (
  <path
    key={`wave-${x}-${y}`}
    d="M 0 0 C 1 -0.6, 2 -0.6, 3 0 M 1.5 -0.8 C 2.5 -1.4, 3.5 -1.4, 4.5 -0.8"
    fill="none"
    stroke="var(--color-line-soft)"
    strokeWidth="0.2"
    strokeLinecap="round"
    opacity="0.35"
    transform={`translate(${x}, ${y})`}
  />
);

// Pine tree clusters in the southeast empty town grasslands
const TreeGlyph = ({ x, y }: { x: number; y: number }) => (
  <g
    key={`tree-${x}-${y}`}
    transform={`translate(${x}, ${y})`}
    stroke="var(--color-ink-mute)"
    strokeWidth="0.25"
    fill="none"
    opacity="0.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Center tree */}
    <path d="M 0 0 L 0 -2.2 M -1.0 -1.4 L 0 -2.2 L 1.0 -1.4 M -0.8 -0.8 L 0 -1.5 L 0.8 -0.8" />
    {/* Left smaller tree */}
    <path d="M -1.5 0 L -1.5 -1.6 M -2.2 -1.1 L -1.5 -1.6 L -0.8 -1.1 M -2.0 -0.6 L -1.5 -1.1 L -1.0 -0.6" />
    {/* Right smaller tree */}
    <path d="M 1.5 0 L 1.5 -1.6 M 0.8 -1.1 L 1.5 -1.6 L 2.2 -1.1 M 1.0 -0.6 L 1.5 -1.1 L 2.0 -0.6" />
  </g>
);

// Sandy desert dunes in the northwest arid wasteland
const DuneGlyph = ({ x, y }: { x: number; y: number }) => (
  <path
    key={`dune-${x}-${y}`}
    d="M 0 0 Q 2.2 -1.1, 4.4 0 M 1.2 -0.6 Q 3 -1.8, 4.8 -0.6"
    fill="none"
    stroke="var(--color-ink-soft)"
    strokeWidth="0.18"
    strokeLinecap="round"
    opacity="0.35"
    transform={`translate(${x}, ${y})`}
  />
);

export default function MapBackdrop({
  viewBox = "0 0 100 100",
  preserveAspectRatio = "none",
  children,
}: MapBackdropProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const clipPathId = `clip-${uniqueId}`;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        {/* Clip region tints to the landmass so colour never bleeds into the sea. */}
        <clipPath id={clipPathId}>
          <path d={LAND} />
        </clipPath>
      </defs>

      {/* Sea base + faint cartographic hatch lines. */}
      <rect x="0" y="0" width="100" height="100" fill="var(--color-secondary)" opacity="0.05" />

      {/* Ocean sea ripple wave decorations */}
      {WaveGlyph({ x: 8, y: 20 })}
      {WaveGlyph({ x: 15, y: 80 })}
      {WaveGlyph({ x: 45, y: 92 })}
      {WaveGlyph({ x: 84, y: 25 })}
      {WaveGlyph({ x: 92, y: 70 })}
      {WaveGlyph({ x: 30, y: 8 })}

      {/* Full 10x10 cartographic coordinate grid */}
      <g stroke="var(--color-line-soft)" strokeWidth="0.12" opacity="0.45">
        {Array.from({ length: 9 }, (_, i) => {
          const coord = (i + 1) * 10;
          return (
            <React.Fragment key={`grid-${coord}`}>
              {/* Vertical line */}
              <line x1={coord} y1="0" x2={coord} y2="100" />
              {/* Horizontal line */}
              <line x1="0" y1={coord} x2="100" y2={coord} />
            </React.Fragment>
          );
        })}
      </g>

      {/* Main continent landmass */}
      <path
        d={LAND}
        fill="var(--color-paper-warm)"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.4"
        opacity="0.92"
      />

      {/* Soft biome tints, clipped to land. */}
      <g clipPath={`url(#${clipPathId})`}>
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

        {/* Dune details placed on the desert land */}
        {DuneGlyph({ x: 19, y: 22 })}
        {DuneGlyph({ x: 28, y: 24 })}
        {DuneGlyph({ x: 15, y: 31 })}
        {DuneGlyph({ x: 25, y: 35 })}

        {/* Central Volcanic Highlands Rugged Contour Contortion Lines */}
        <g stroke="var(--color-primary)" strokeWidth="0.18" fill="none" opacity="0.25" strokeLinejoin="round" strokeLinecap="round">
          <path d="M43,43 L46,44 L48,42 L52,43 L55,42" />
          <path d="M42,47 L45,48 L49,46 L53,49" />
        </g>

        {/* SW Coast Sandy Wave Outline Contours */}
        <g stroke="var(--color-line-soft)" strokeWidth="0.2" fill="none" opacity="0.45" strokeLinecap="round">
          <path d="M10,58 C8,64 12,70 14,74" />
          <path d="M11,59 C9.3,64.5 13,70 15,73" strokeDasharray="1 1" />
        </g>

        {/* SE Tree Clusters on grassland shores */}
        {TreeGlyph({ x: 72, y: 72 })}
        {TreeGlyph({ x: 78, y: 68 })}
        {TreeGlyph({ x: 67, y: 75 })}
        {TreeGlyph({ x: 81, y: 76 })}
      </g>

      {/* Floating sky islands (Sparkling Floating Island / Huge Building) — detached above land. */}
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

      {children}
    </svg>
  );
}
