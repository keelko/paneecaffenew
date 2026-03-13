import React from 'react';

const AnimatedChickenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M36 40a16 16 0 1 1-28-16" />
        <path d="M22 22l-8-8" />
        <path d="M14 14l-4 4" />
        <path d="M36 40s8 12 16 8s4-16-4-16-12 8-12 8z" />
    </svg>
);

export default AnimatedChickenIcon;
