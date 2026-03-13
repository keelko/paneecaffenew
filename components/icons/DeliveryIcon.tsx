import React from 'react';

const DeliveryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path d="M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M15 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="m15.42 15.82-.72-.72" />
    <path d="M5 15h3.58a1 1 0 0 1 .9.58l1.42 2.84a1 1 0 0 0 .9.58H17" />
    <path d="M17 9.58a1 1 0 0 0-1-.98h-2.24a1 1 0 0 0-.97.74l-.59 2.36" />
    <path d="M9.42 12.82.72 12.1" />
    <path d="M12 12h-2" />
    <path d="M7 9h2" />
    <path d="M13.5 6.5 12 5H9.5a1 1 0 0 0-1 1v2" />
  </svg>
);

export default DeliveryIcon;