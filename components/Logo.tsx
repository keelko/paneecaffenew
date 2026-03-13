import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative rounded-full transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(255,95,51,0.8)] ${className}`}> 
      <img 
        src="https://i.imgur.com/uwZSNQw.png" 
        alt="Pane & Caffè Logo" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Logo;