import React from 'react';
import Logo from './Logo';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onScrollToTop: () => void;
  isCartAnimating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onScrollToTop, isCartAnimating }) => {
  return (
    <header className="bg-brand-cream/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm border-b border-brand-red/10">
      <div className="container mx-auto px-4 h-20 md:h-28 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onScrollToTop} className="group" aria-label="Torna in cima">
            <Logo className="h-16 md:h-[83px] w-auto"/>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className={`relative text-brand-dark hover:text-brand-red transition-colors duration-300 p-2 rounded-full hover:bg-brand-red/5 ${isCartAnimating ? 'animate-cart-jiggle-once' : ''}`}
            aria-label="Apri carrello"
          >
            <ShoppingCartIcon className="h-8 w-8 md:h-12 md:w-12" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs md:text-sm font-bold rounded-full h-5 w-5 md:h-8 md:w-8 flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);