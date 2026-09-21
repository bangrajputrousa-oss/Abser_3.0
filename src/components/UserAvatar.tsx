import React from 'react';

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'card';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
    card: 'w-24 h-32 text-2xl', // for Muqeem card
  };

  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={name}
        className={`object-cover shadow-sm ${sizeClasses[size]} ${className}`}
      />
    );
  }

  // Authentic representation matching the screenshot thumbnail
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#3a352d] via-[#242220] to-[#141517] flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      title={name}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background warm hotel/indoor tone */}
        <rect width="100" height="120" fill="#2b2319" />
        <circle cx="50" cy="15" r="45" fill="#4d3b24" opacity="0.5" />
        
        {/* Shoulders & blue shirt */}
        <path
          d="M10 120 C 12 95, 25 80, 50 80 C 75 80, 88 95, 90 120 Z"
          fill="#1d3d63"
        />
        {/* Shirt collar pattern */}
        <path d="M42 80 L50 98 L58 80 Z" fill="#fff" opacity="0.8" />
        <path d="M46 84 L50 94 L54 84 Z" fill="#0d233e" />
        
        {/* Neck */}
        <rect x="42" y="65" width="16" height="20" fill="#a5714e" rx="3" />
        
        {/* Head */}
        <ellipse cx="50" cy="48" rx="20" ry="24" fill="#a5714e" />
        
        {/* Hair */}
        <path
          d="M30 46 C 30 28, 38 24, 50 24 C 62 24, 70 28, 70 46 C 68 35, 62 30, 50 30 C 38 30, 32 35, 30 46 Z"
          fill="#1b1715"
        />
        
        {/* Beard & Moustache */}
        <path
          d="M34 50 C 34 72, 42 75, 50 75 C 58 75, 66 72, 66 50 C 63 65, 57 70, 50 70 C 43 70, 37 65, 34 50 Z"
          fill="#1e1814"
          opacity="0.85"
        />
        {/* Moustache */}
        <path
          d="M38 58 C 44 56, 56 56, 62 58 C 58 63, 42 63, 38 58 Z"
          fill="#1b1715"
        />
        {/* Eyes */}
        <ellipse cx="43" cy="46" rx="2.5" ry="2" fill="#1b1715" />
        <ellipse cx="57" cy="46" rx="2.5" ry="2" fill="#1b1715" />
        <circle cx="43.5" cy="45.5" r="0.6" fill="#fff" />
        <circle cx="57.5" cy="45.5" r="0.6" fill="#fff" />
        {/* Eyebrows */}
        <path d="M39 42 Q44 40 48 42" stroke="#1c1613" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M52 42 Q56 40 61 42" stroke="#1c1613" strokeWidth="1.8" strokeLinecap="round" />
        {/* Nose */}
        <path d="M50 46 L48 53 L52 53" stroke="#875333" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
