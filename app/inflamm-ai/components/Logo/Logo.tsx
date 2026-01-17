import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 48, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFB84D', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF8A00', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Outer Circle Ring - Protective Shield */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="10"
      />
      
      {/* Person Head - centered */}
      <circle cx="35" cy="35" r="10" fill="url(#logoGradient)"/>
      
      {/* Person Shoulders - centered */}
      <path 
        d="M 25,48 Q 25,46 27,46 L 43,46 Q 45,46 45,48 L 45,53 L 25,53 Z" 
        fill="url(#logoGradient)"
      />
      
      {/* Large Heart - The Core Reactor - centered and larger with inner heart cutout */}
      <path 
        d="M 35,73 L 21,59 Q 18,56 18,51.5 Q 18,47 21,46 Q 24,45 28,49 L 35,56 L 42,49 Q 46,45 49,46 Q 52,47 52,51.5 Q 52,56 49,59 L 35,73 Z
           M 35,66 L 26,57 Q 24,55 24,53 Q 24,51 26,51 Q 28,51 30,53 L 35,58 L 40,53 Q 42,51 44,51 Q 46,51 46,53 Q 46,55 44,57 L 35,66 Z" 
        fill="url(#logoGradient)"
        fillRule="evenodd"
      />
      
      {/* Signal Wave 1 - small dot (innermost) */}
      <circle cx="58" cy="40" r="3" fill="url(#logoGradient)"/>
      
      {/* Signal Wave 2 - medium arc */}
      <path 
        d="M 56,32 Q 64,36 64,44" 
        stroke="url(#logoGradient)"
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Signal Wave 3 - large arc (outermost) */}
      <path 
        d="M 63,25 Q 73,31 73,44" 
        stroke="url(#logoGradient)"
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round"
      />
    </svg>
  );
};
