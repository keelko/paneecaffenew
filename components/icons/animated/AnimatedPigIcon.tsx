import React from 'react';

const AnimatedPigIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M32 12a20 20 0 0 1 0 40 20 20 0 0 1 0-40z" />
        <circle cx="32" cy="36" r="8" />
        <circle cx="29" cy="36" r="1" stroke="none" fill="currentColor" />
        <circle cx="35" cy="36" r="1" stroke="none" fill="currentColor" />
        <path d="M24 20s-2-4-6-3" />
        <path d="M40 20s2-4 6-3" />
    </svg>
);

export default AnimatedPigIcon;
