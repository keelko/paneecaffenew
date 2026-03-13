import React from 'react';

const CheeseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 11.25v2.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125V11.25m19.5 0v-2.25c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V11.25m19.5 0a2.25 2.25 0 00-2.25-2.25H3.375a2.25 2.25 0 00-2.25 2.25m19.5 0A2.25 2.25 0 0119.5 13.5H3.375a2.25 2.25 0 01-2.25-2.25m19.5 0a9 9 0 00-18 0" />
  </svg>
);

export default CheeseIcon;
