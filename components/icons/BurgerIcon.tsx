import React from 'react';

const BurgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.25H7.5a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 7.5 5.25h9A2.25 2.25 0 0 1 18.75 7.5v8.5a2.25 2.25 0 0 1-2.25 2.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75h13.5" />
  </svg>
);

export default BurgerIcon;
