import React from 'react';

const AnimatedBurgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 23h22" />
    <path d="M5 18h22" />
    <path d="M5 14s2-2 6-2 6 2 6 2 2-2 6-2" />
    <path d="M5 14a11 11 0 0 1 22 0" />
    <path d="M13 9h.01" stroke="none" fill="currentColor" />
    <path d="M16 8h.01" stroke="none" fill="currentColor" />
    <path d="M19 9h.01" stroke="none" fill="currentColor" />
  </svg>
);

export default AnimatedBurgerIcon;
