import React from 'react';

const VegetarianIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M11.645 20.91a.75.75 0 0 1-1.29 0l-5.64-10.43a.75.75 0 0 1 1.29-.73L12 14.865l5.245-5.113a.75.75 0 1 1 1.06 1.06l-6.25 6.125a.75.75 0 0 1-1.06 0l-1.562-1.522a.75.75 0 0 1 0-1.06Z" />
    <path d="M12.992 3.12a.75.75 0 0 0-1.02-.738l-6.25 2.162a.75.75 0 0 0 .738 1.02L12 4.135l4.897 1.696a.75.75 0 0 0 1.02-.738l-2.162-6.25Z" />
  </svg>
);

export default VegetarianIcon;
