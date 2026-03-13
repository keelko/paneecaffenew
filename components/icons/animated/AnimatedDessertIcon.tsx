import React from 'react';

const AnimatedDessertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="32" cy="32" r="20" />
        <circle cx="32" cy="32" r="8" />
        <path d="M22 26s2-4 6-4" />
        <path d="M42 26s-2-4-6-4" />
        <path d="M26 44s-4-2-4-6" />
        <path d="M38 44s4-2 4-6" />
    </svg>
);

export default AnimatedDessertIcon;
