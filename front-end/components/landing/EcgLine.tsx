"use client";

const ECG_PATH =
  "M0,30 L18,30 L20,27 L22,30 " +
  "L36,30 L40,30 L42,8 L44,52 L46,3 L48,57 L50,30 L52,30 " +
  "L56,21 L62,30 L78,30 " +
  "L96,30 L98,27 L100,30 " +
  "L114,30 L118,30 L120,8 L122,52 L124,3 L126,57 L128,30 L130,30 " +
  "L134,21 L140,30 L156,30 " +
  "L174,30 L176,27 L178,30 " +
  "L192,30 L196,30 L198,8 L200,52 L202,3 L204,57 L206,30 L208,30 " +
  "L212,21 L218,30 L240,30";

interface EcgLineProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function EcgLine({
  className,
  primaryColor = "#00d4ff",
  secondaryColor = "#00ffee",
}: EcgLineProps) {
  return (
    <div className={className} aria-hidden="true" role="presentation">
      <svg
        viewBox="0 0 240 60"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="ecg-main-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
            <stop offset="25%" stopColor={primaryColor} stopOpacity="0.9" />
            <stop offset="55%" stopColor={secondaryColor} stopOpacity="1" />
            <stop offset="80%" stopColor="#00ff88" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </linearGradient>
          <filter id="ecg-glow" x="-10%" y="-200%" width="120%" height="500%">
            <feGaussianBlur stdDeviation="2.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost trace */}
        <path
          d={ECG_PATH}
          fill="none"
          stroke={primaryColor}
          strokeWidth="0.7"
          opacity="0.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated glow trace */}
        <path
          d={ECG_PATH}
          fill="none"
          stroke={`url(#ecg-main-grad)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecg-glow)"
          className="ecg-animate"
        />
      </svg>
    </div>
  );
}
