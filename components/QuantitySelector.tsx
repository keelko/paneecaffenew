import React from 'react';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange, disabled = false }) => {
  return (
    <div className="flex items-center rounded-md bg-black/30">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="text-white p-2 rounded-l-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Riduci quantità"
        disabled={disabled}
      >
        <MinusIcon className="h-5 w-5" />
      </button>
      <span className="px-4 text-lg font-bold w-12 text-center">{quantity}</span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="text-white p-2 rounded-r-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Aumenta quantità"
        disabled={disabled}
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default QuantitySelector;