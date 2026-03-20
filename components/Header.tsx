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
    <header className="bg-brand-cream/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm border-b border-brand-red/10 pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-4 h-[80px] md:h-[110px] flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onScrollToTop} className="group" aria-label="Torna in cima">
            <Logo className="h-[58px] md:h-[85px] w-auto"/>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className={`relative text-brand-dark hover:text-brand-red transition-colors duration-300 p-2 rounded-full hover:bg-brand-red/5 ${isCartAnimating ? 'animate-cart-jiggle-once' : ''}`}
            aria-label="Apri carrello"
          >
            <ShoppingCartIcon className="h-[32px] w-[32px] md:h-[45px] w-[45px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] md:text-xs font-bold rounded-full h-[20px] w-[20px] md:h-[28px] w-[28px] flex items-center justify-center animate-pulse">
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