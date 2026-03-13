import React from 'react';
import TomatoIcon from './icons/ingredients/TomatoIcon';
import LettuceIcon from './icons/ingredients/LettuceIcon';
import BaconIcon from './icons/ingredients/BaconIcon';
import CheeseIcon from './icons/ingredients/CheeseIcon';
import OnionIcon from './icons/ingredients/OnionIcon';

interface IngredientIconProps {
  ingredient: string;
  className?: string;
}

const IngredientIcon: React.FC<IngredientIconProps> = ({ ingredient, className = "h-5 w-5 inline-block mr-2 text-gray-400 flex-shrink-0" }) => {
  const lowerIngredient = ingredient.toLowerCase();

  if (lowerIngredient.includes('pomodoro')) {
    return <TomatoIcon className={className} />;
  }
  if (lowerIngredient.includes('insalata') || lowerIngredient.includes('lattuga') || lowerIngredient.includes('cavolo')) {
    return <LettuceIcon className={className} />;
  }
  if (lowerIngredient.includes('bacon') || lowerIngredient.includes('pancetta')) {
    return <BaconIcon className={className} />;
  }
  if (lowerIngredient.includes('cheddar') || lowerIngredient.includes('provola') || lowerIngredient.includes('formaggio')) {
    return <CheeseIcon className={className} />;
  }
  if (lowerIngredient.includes('cipolla')) {
    return <OnionIcon className={className} />;
  }
  
  // Generic fallback icon for other ingredients
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
  );
};

export default IngredientIcon;
