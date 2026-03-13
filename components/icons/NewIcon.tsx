import React from 'react';

const NewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path fillRule="evenodd" d="M9 3.75a.75.75 0 0 1 .75.75v.75h3v-.75a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75a.75.75 0 0 1-1.5 0v-.75a1.5 1.5 0 0 0-1.5-1.5h-.75v3h.75a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75a.75.75 0 0 1 0-1.5h.75a1.5 1.5 0 0 0 1.5-1.5v-.75h-3v.75a1.5 1.5 0 0 0 1.5 1.5h.75a.75.75 0 0 1 0 1.5h-.75a3 3 0 0 1-3-3v-.75a.75.75 0 0 1 1.5 0v.75a1.5 1.5 0 0 0 1.5 1.5h.75v-3h-.75a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75a.75.75 0 0 1 0 1.5h-.75a1.5 1.5 0 0 0-1.5 1.5v.75h3v-.75a1.5 1.5 0 0 0-1.5-1.5h-.75V4.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export default NewIcon;
