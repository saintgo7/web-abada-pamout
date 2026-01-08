
import React from 'react';

interface LogoProps {
  isDarkMode: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ isDarkMode, className = "h-8" }) => {
  if (isDarkMode) {
    // Neon style for dark mode (recreating the second image)
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <svg viewBox="0 0 280 80" className="h-full w-auto filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <text 
            x="10" y="60" 
            className="font-bold italic" 
            style={{ 
              fontSize: '54px', 
              fill: 'none', 
              stroke: 'url(#neonGradient)', 
              strokeWidth: '1.5',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            PamOut
          </text>
          {/* Arrow element recreation */}
          <path 
            d="M175 40 L210 20 L205 45 L215 45 L180 65 Z" 
            fill="none" 
            stroke="url(#neonGradient)" 
            strokeWidth="1.5"
          />
        </svg>
        <span className="text-[8px] font-bold tracking-[0.4em] text-cyan-400 -mt-1 uppercase">OUTSOURCING SOLUTIONS</span>
      </div>
    );
  }

  // Gradient style for light mode (recreating the first image)
  return (
    <div className={`flex flex-col items-end ${className}`}>
      <svg viewBox="0 0 280 80" className="h-full w-auto">
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="60%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <text 
          x="10" y="60" 
          className="font-black italic" 
          style={{ 
            fontSize: '58px', 
            fill: 'url(#brandGradient)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          PamOut
        </text>
        {/* Arrow element recreation */}
        <path 
          d="M175 40 L215 15 L205 45 L220 45 L180 70 Z" 
          fill="url(#brandGradient)" 
        />
      </svg>
      <span className="text-[10px] font-black text-blue-600 -mt-2 mr-2">.com</span>
    </div>
  );
};

export default Logo;
