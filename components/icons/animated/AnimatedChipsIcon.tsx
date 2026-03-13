import React from 'react';

const AnimatedChipsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 21V11.5a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 17 11.5V21H7z" />
    <path d="M9.5 9V5" />
    <path d="M12 9V4" />
    <path d="M14.5 9V5" />
  </svg>
);

export default AnimatedChipsIcon;
