import React from 'react';

const AnimatedKidsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 52a20 20 0 0 0 40 0" />
        <path d="M22 52v-8" />
        <path d="M42 52v-8" />
        <path d="M16 44h32v-8a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v8z" />
        <path d="M48 32l4-8h-4" />
        <circle cx="46" cy="28" r="1.5" stroke="none" fill="currentColor" />
    </svg>
);

export default AnimatedKidsIcon;
