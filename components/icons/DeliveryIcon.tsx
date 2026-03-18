import React from 'react';

const DeliveryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <img 
      src="https://i.imgur.com/LmldRAG.png" 
      alt="Delivery" 
      className={`${className} object-contain`}
      style={{ 
        filter: className?.includes('text-white') ? 'brightness(0) invert(1)' : 'none',
        width: '2rem',
        height: '2rem'
      }}
      referrerPolicy="no-referrer"
    />
  );
};

export default DeliveryIcon;