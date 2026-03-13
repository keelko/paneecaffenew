import React from 'react';

const CurvedArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M5 5 C 50 5, 95 50, 95 95" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    <path 
      d="M83 95 L95 95 L95 83" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default CurvedArrowIcon;