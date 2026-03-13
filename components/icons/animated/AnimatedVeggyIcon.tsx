import React from 'react';

const AnimatedVeggyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M32 56C16 56 8 36 32 12 56 36 48 56 32 56z" />
        <path d="M32 56V12" />
    </svg>
);

export default AnimatedVeggyIcon;
