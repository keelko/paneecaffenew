import React from 'react';

const OnionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75C15.75 18.428 13.528 20.65 10.85 20.65C8.172 20.65 5.95 18.428 5.95 15.75M15.75 15.75V11.25m0 4.5a3.375 3.375 0 00-6.75 0m6.75 0a3.375 3.375 0 01-6.75 0m0 0V11.25m6.75 4.5h.008v.008h-.008v-.008zm-6.75 0h.008v.008h-.008v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3V6" />
  </svg>
);

export default OnionIcon;
