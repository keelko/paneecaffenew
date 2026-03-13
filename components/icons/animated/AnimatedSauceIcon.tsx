import React from 'react';

const AnimatedSauceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 24s-4 16 12 16 12-16 12-16z" />
        <path d="M20 24h24" />
        <path d="M24 24s-1 12 8 12 8-12 8-12" />
        <path d="M32 52v-12" />
        <path d="M24 52h16" />
    </svg>
);

export default AnimatedSauceIcon;