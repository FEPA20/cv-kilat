export default function LogoCVKilat({
  theme = "light",
  showTagline = true,
  tagline = "Build CV in seconds",
  compact = false,
  className = "",
}) {
  const dark = theme === "dark";
  const primaryText = dark ? "#FFFFFF" : "#0F172A";
  const secondaryText = dark ? "#94A3B8" : "#64748B";

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      aria-label="CV Kilat"
    >
      <svg
        width={compact ? 40 : 48}
        height={compact ? 40 : 48}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        className="shrink-0 drop-shadow-[0_8px_18px_rgba(245,158,11,0.22)]"
      >
        <defs>
          <linearGradient id="cvk-bolt" x1="19" y1="9" x2="49" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE25A" />
            <stop offset="0.52" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="cvk-fold" x1="39" y1="7" x2="53" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="cvk-shadow" x="8" y="4" width="52" height="58" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#020617" floodOpacity="0.22" />
          </filter>
        </defs>

        <g opacity="0.95">
          <path d="M6 25H16" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <path d="M3 32H16" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <path d="M7 39H17" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g filter="url(#cvk-shadow)">
          <path
            d="M21 7.5H40.5L52 19V53.5C52 55.433 50.433 57 48.5 57H21C19.067 57 17.5 55.433 17.5 53.5V11C17.5 9.067 19.067 7.5 21 7.5Z"
            fill={dark ? "#0B1220" : "#FFFFFF"}
            stroke={dark ? "#E2E8F0" : "#0F172A"}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M40.5 7.5V16C40.5 17.657 41.843 19 43.5 19H52" fill="url(#cvk-fold)" />
          <path d="M40.5 7.5V16C40.5 17.657 41.843 19 43.5 19H52" stroke="#F59E0B" strokeWidth="2.5" strokeLinejoin="round" />

          <path d="M24 21H35" stroke={dark ? "#CBD5E1" : "#475569"} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 27H32" stroke={dark ? "#CBD5E1" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 33H29" stroke={dark ? "#CBD5E1" : "#94A3B8"} strokeWidth="2.5" strokeLinecap="round" />

          <path
            d="M36.5 20L22.5 39.5H32L26.5 55L45.5 32H35.5L36.5 20Z"
            fill="url(#cvk-bolt)"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <div className="leading-none">
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span
            className={`${compact ? "text-xl" : "text-2xl"} font-black tracking-[-0.04em]`}
            style={{ color: primaryText }}
          >
            CV
          </span>
          <span
            className={`${compact ? "text-xl" : "text-2xl"} font-black italic tracking-[-0.04em]`}
            style={{ color: "#FBBF24" }}
          >
            Kilat
          </span>
        </div>

        {showTagline && (
          <p
            className={`${compact ? "mt-1 text-[10px]" : "mt-1.5 text-[11px]"} font-semibold tracking-[0.22em] uppercase whitespace-nowrap`}
            style={{ color: secondaryText }}
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}