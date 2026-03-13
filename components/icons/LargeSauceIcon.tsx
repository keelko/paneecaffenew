import React from 'react';

const LargeSauceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="sans-serif" fill="currentColor" stroke="none">L</text>
  </svg>
);

export default LargeSauceIcon;