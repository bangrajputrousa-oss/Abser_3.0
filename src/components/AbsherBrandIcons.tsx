import React from 'react';

/**
 * Authentic Absher vertical bars emblem matching the official Saudi Absher app
 */
export const AbsherIcon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-12 h-14',
  color = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 72 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Absher Logo"
    >
      {/* 3 Dots on top of bars */}
      <circle cx="27" cy="18" r="3.2" fill={color} />
      <circle cx="39" cy="18" r="3.2" fill={color} />
      <circle cx="33" cy="9" r="3.2" fill={color} />

      {/* 5 Vertical Bars with bottom align */}
      {/* Bar 1 (leftmost) */}
      <rect x="3" y="44" width="7" height="38" rx="3.5" fill={color} />
      {/* Bar 2 */}
      <rect x="15" y="34" width="7" height="48" rx="3.5" fill={color} />
      {/* Bar 3 */}
      <rect x="27" y="27" width="7" height="55" rx="3.5" fill={color} />
      {/* Bar 4 */}
      <rect x="39" y="30" width="7" height="52" rx="3.5" fill={color} />
      {/* Bar 5 (rightmost tall Alif with slight angled top) */}
      <path
        d="M51 24.5C51 22.5 52.8 21 54.8 21.5L62 23.5V78.5C62 80.4 60.4 82 58.5 82H54.5C52.6 82 51 80.4 51 78.5V24.5Z"
        fill={color}
      />
    </svg>
  );
};

/**
 * Authentic Saudi Ministry of Interior (MOI) circular seal emblem
 */
export const MoiCrestIcon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-14 h-14',
  color = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Saudi Ministry of Interior Emblem"
    >
      {/* Outer dual circle border */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />

      {/* Palm Tree in center */}
      {/* Fronds */}
      <path
        d="M50 25C47 21 42 22 41 24C45 25 48 28 48 31C45 28 40 28 38 31C43 32 46 35 47 38C43 36 38 37 36 40C42 41 46 44 47 48L50 48L53 48C54 44 58 41 64 40C62 37 57 36 53 38C54 35 57 32 62 31C60 28 55 28 52 31C52 28 55 25 59 24C58 22 53 21 50 25Z"
        fill={color}
      />
      {/* Trunk */}
      <path
        d="M48.5 44H51.5L52.5 56H47.5L48.5 44Z"
        fill={color}
      />
      {/* Crossed Swords below Palm Tree */}
      {/* Sword 1: top-left to bottom-right */}
      <path
        d="M34 52L62 68M62 68L64 70M62 68L66 65M34 52L32 50"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Sword 2: top-right to bottom-left */}
      <path
        d="M66 52L38 68M38 68L36 70M38 68L34 65M66 52L68 50"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Surrounding Wreath & Calligraphy Arc */}
      <path
        d="M24 64C20 54 22 40 30 32M76 64C80 54 78 40 70 32"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M26 72C33 80 43 83 50 83C57 83 67 80 74 72"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="77" r="2" fill={color} />
    </svg>
  );
};

/**
 * Side-by-side Absher vertical logo + Saudi MOI crest as shown in the OTP screen
 */
export const AbsherDualEmblem: React.FC<{ className?: string }> = ({
  className = 'h-14',
}) => {
  return (
    <div className={`flex items-center justify-center gap-3.5 ${className}`}>
      <AbsherIcon className="w-11 h-14 text-white" />
      <MoiCrestIcon className="w-13 h-13 text-white" />
    </div>
  );
};
