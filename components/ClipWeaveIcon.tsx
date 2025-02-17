import React from 'react';

export const ClipWeaveIcon = ({ className = "w-6 h-6" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Film strip frame */}
      <rect 
        x="3" 
        y="3" 
        width="18" 
        height="18" 
        rx="3"
        className="stroke-current"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Film strip holes */}
      <rect x="6" y="6" width="1.5" height="1.5" rx="0.5" className="fill-current" />
      <rect x="6" y="16.5" width="1.5" height="1.5" rx="0.5" className="fill-current" />
      <rect x="16.5" y="6" width="1.5" height="1.5" rx="0.5" className="fill-current" />
      <rect x="16.5" y="16.5" width="1.5" height="1.5" rx="0.5" className="fill-current" />

      {/* Audio wave + Video interweave symbol */}
      <path
        d="M9 8.5C9 8.5 10 10 10 12C10 14 9 15.5 9 15.5"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 8.5C15 8.5 14 10 14 12C14 14 15 15.5 15 15.5"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 7.5V16.5"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}; 