import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative transition-all duration-300 ease-in-out group-hover:scale-105 ${className}`}> 
      <img 
        src="https://i.imgur.com/emHh9op.png" 
        alt="Pane & Caffè Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;