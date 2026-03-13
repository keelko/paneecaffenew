import React from 'react';

const FriesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5.25v13.5m-3-13.5v13.5m12-13.5v13.5m3-13.5v13.5m-9-16.5h3m-6.75 0h.008v.008H9.75V2.25zm5.25 0h.008v.008H15V2.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75h15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25h15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 5.25l-1.875-3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.625 5.25l1.875-3" />
  </svg>
);

export default FriesIcon;
