import React from 'react';

const ReceiptIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m0 0h1.5m-1.5 0h-3m3 3h-3m-3 0h1.5m-1.5 0h-3m16.5 0h3m-3 0h-3M12 6.75h3m-3 0h-3m-3 0h3m3 0h-3m-3 0h-3m9 3.75h3m-3 0h-3m-3 0h3m3 0h-3m-3 0h-3m9 3.75h3m-3 0h-3m-3 0h3m3 0h-3m-3 0h-3m9 3.75h3m-3 0h-3m-3 0h3m3 0h-3m-3 0h-3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

export default ReceiptIcon;