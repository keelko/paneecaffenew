import React from 'react';

const AnimatedDrinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 21h10l1-13H6l1 13z" />
    <path d="M5.5 8h13" />
    <path d="M15 8L13 4" />
  </svg>
);

export default AnimatedDrinkIcon;
