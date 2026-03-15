import React from 'react';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface FloatingCartBarProps {
  itemCount: number;
  totalPrice: number;
  onClick: () => void;
  isAnimating?: boolean;
  isVisible?: boolean;
}

const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ itemCount, totalPrice, onClick, isAnimating, isVisible }) => {
  if (itemCount === 0 || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96 animate-slide-up">
      <button
        onClick={onClick}
        className={`w-full bg-brand-orange text-brand-dark h-16 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center overflow-hidden group active:scale-95 hover:scale-[1.02] transition-all duration-300 border-2 border-brand-dark/10 ${isAnimating ? 'scale-105 shadow-[0_0_30px_rgba(255,95,51,0.8)]' : ''}`}
      >
        {/* Sinistra: Icona e Conteggio */}
        <div className="w-16 h-full flex items-center justify-center border-r border-brand-dark/15">
          <div className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-brand-dark" />
            <span className="absolute -top-2.5 -right-2.5 bg-brand-dark text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
              {itemCount}
            </span>
          </div>
        </div>

        {/* Centro: Testo */}
        <div className="flex-grow flex flex-col items-center justify-center px-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 leading-none mb-0.5">Vedi</span>
          <span className="text-lg font-brand uppercase tracking-tight leading-none">Carrello</span>
        </div>

        {/* Separatore Verticale */}
        <div className="w-[1px] h-8 bg-brand-dark/15"></div>

        {/* Destra: Prezzo e Freccia */}
        <div className="flex items-center gap-3 px-4 h-full">
          <span className="font-brand text-2xl tracking-tight text-brand-dark">
            €{totalPrice.toFixed(2)}
          </span>
          <div className="bg-brand-dark text-brand-orange p-1.5 rounded-full shadow-lg">
            <svg className="w-3.5 h-3.5 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
};

export default FloatingCartBar;
