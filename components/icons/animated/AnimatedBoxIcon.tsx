import React from 'react';

const AnimatedBoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 48l8-24h24l8 24" />
        <path d="M12 48h40" />
        <path d="M20 24h24" />
        <path d="M28 24s0-8 4-8 4 8 4 8" />
    </svg>
);

export default AnimatedBoxIcon;
