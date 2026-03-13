import React from 'react';

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5m-6.75 0h6.75m-6.75 0H6.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V8.625c0-.621-.504-1.125-1.125-1.125H15.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6" />
  </svg>
);

export default MenuIcon;
