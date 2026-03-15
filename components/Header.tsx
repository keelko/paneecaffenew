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
    <header className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 h-40 flex justify-between items-center">
        <div className="flex items-center">
          <a href="https://www.panecaffe.info/" target="_blank" rel="noopener noreferrer" className="group" aria-label="Vai al sito ufficiale di Pane & Caffè">
            <Logo className="h-36 w-36"/>
          </a>
          <button onClick={onScrollToTop} className="ml-4 group" aria-label="Torna in cima">
            <div className="relative">
                <span className="font-brand text-5xl tracking-wider text-brand-cream">PANE & CAFFÈ</span>
                <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-brand-orange origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out animate-pulse-underline"></div>
            </div>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className={`relative text-white hover:text-brand-orange transition-colors duration-300 p-2 rounded-full hover:bg-white/10 ${isCartAnimating ? 'animate-cart-jiggle-once' : ''}`}
            aria-label="Apri carrello"
          >
            <ShoppingCartIcon className="h-12 w-12" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center animate-pulse">
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