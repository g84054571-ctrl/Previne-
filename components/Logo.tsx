import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  centered = false,
  withText = true
}) => {
  // Font sizes for the main Previne+ wordmark
  const titleSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-7xl md:text-8xl'
  };

  // Font sizes and margins for the subtitle
  const subtitleSizes = {
    sm: 'text-[6px] tracking-[0.25em] mt-1',
    md: 'text-[9px] tracking-[0.28em] mt-1.5',
    lg: 'text-[11px] tracking-[0.32em] mt-3',
    xl: 'text-[13px] md:text-[14px] tracking-[0.35em] mt-4'
  };

  const containerSpacing = {
    sm: 'py-0.5',
    md: 'py-1',
    lg: 'py-2',
    xl: 'py-4'
  };

  // Exact CSS gradient from left to right to match the uploaded image perfectly
  const gradientStyle = {
    background: 'linear-gradient(to right, #7C3AED 0%, #D946EF 35%, #F43F5E 68%, #FF6B4A 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} ${containerSpacing[size]} select-none leading-none cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-all duration-300`}>
      {/* Previne+ Wordmark */}
      <h1 
        className={`${titleSizes[size]} font-black tracking-tighter select-none leading-none`}
        style={gradientStyle}
      >
        Previne+
      </h1>

      {/* Subtitle brand message exactly matching the image */}
      {withText && (
        <span className={`font-black text-slate-400 uppercase ${subtitleSizes[size]}`}>
          BY SPARK TECH OFICIAL
        </span>
      )}
    </div>
  );
};
