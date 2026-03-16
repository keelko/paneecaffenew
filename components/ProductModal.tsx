import React, { useState, useMemo, Fragment, useEffect, useRef } from 'react';
import { Product, CartItem, CartItemVariant, Extra, SelectedExtra } from '../types';
import { REMOVABLE_INGREDIENTS, EXTRAS_BURGER, EXTRAS_SAUCES, EXTRAS_CHIPS, DRINKS, FRY_SAUCES, KIDS_DRINKS } from '../constants';
import XMarkIcon from './icons/XMarkIcon';
import QuantitySelector from './QuantitySelector';
import BurgerIcon from './icons/BurgerIcon';
import MenuIcon from './icons/MenuIcon';
import DrinkIcon from './icons/DrinkIcon';
import FriesIcon from './icons/FriesIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import MinusIcon from './icons/MinusIcon';
import SparklesIcon from './icons/SparklesIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>, quantity: number) => void;
  initialVariant?: CartItemVariant;
  mode?: 'quick-menu' | 'full-customize';
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, initialVariant = 'panino', mode = 'full-customize' }) => {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState<CartItemVariant>(initialVariant);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addedExtras, setAddedExtras] = useState<SelectedExtra[]>([]);
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | null>(null);
  const [selectedFrySauces, setSelectedFrySauces] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [drinkError, setDrinkError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [highlightDrink, setHighlightDrink] = useState(false);
  const drinkSectionRef = useRef<HTMLDivElement>(null);
  const isAutoAdding = useRef(false);

  useEffect(() => {
    if (variant === 'menu' && selectedDrinkId && !isAutoAdding.current && !isAddedToCart && mode === 'quick-menu') {
      isAutoAdding.current = true;
      // Small delay to let the user see the selection
      const timer = setTimeout(() => {
        handleAddToCartClick();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDrinkId, variant, mode]);

  useEffect(() => {
    if (variant === 'menu') {
      setHighlightDrink(true);
      const timer = setTimeout(() => setHighlightDrink(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [variant]);

  const gallery = useMemo(() => [product.image, ...(product.galleryImages || [])], [product]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % gallery.length);
  };
  
  useEffect(() => {
    if (!isImageZoomed || gallery.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'ArrowLeft') {
            setCurrentImageIndex(prev => (prev - 1 + gallery.length) % gallery.length);
        } else if (e.key === 'ArrowRight') {
            setCurrentImageIndex(prev => (prev + 1) % gallery.length);
        } else if (e.key === 'Escape') {
            setIsImageZoomed(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageZoomed, gallery.length]);

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const hasMenuOption = product.menuPrice !== undefined;
  const isKidsMenu = product.category === 'kids-junior';
  
  const availableRemovableIngredients = useMemo(() => {
    if (!product.ingredients) return [];
    const productIngredientsLower = product.ingredients.map(i => i.toLowerCase());
    return REMOVABLE_INGREDIENTS.filter(removable => 
      productIngredientsLower.some(prodIng => prodIng.includes(removable))
    );
  }, [product.ingredients]);

  const availableExtras = useMemo(() => {
    let extras: Extra[] = [];
    
    if (product.category === 'chips') {
      if (product.id === 16) {
        extras = [];
      } else if (product.id === 17) {
        extras = EXTRAS_CHIPS.filter(e => ['Doppio Bacon', 'Doppio Cheddar'].includes(e.name));
      } else if (product.id === 18) {
        extras = EXTRAS_CHIPS.filter(e => e.name === 'Doppio Cheddar');
      } else {
        extras = [];
      }
    } else {
      extras = [...EXTRAS_BURGER, ...EXTRAS_SAUCES];
    }

    if (product.category === 'box') {
      const forbiddenExtras = ['Bacon', 'Doppio Cheddar', 'Cetriolini', 'Doppio Hamburger', 'Cipolla Caramellata'];
      return extras.filter(extra => !forbiddenExtras.includes(extra.name));
    }
    
    if (product.category === 'sandwich-pollo' || product.category === 'veggy') {
      extras = extras.filter(e => e.name !== 'Doppio Hamburger');
    }

    if (product.category === 'veggy') {
      extras = extras.filter(e => e.name !== 'Bacon');
    }
    
    const productIngredientsLower = product.ingredients?.map(i => i.toLowerCase()) || [];
    extras = extras.filter(extra => {
      const extraLower = extra.name.toLowerCase();
      if (['ketchup', 'maionese', 'barbecue'].includes(extraLower)) {
        if (extraLower === 'barbecue') {
          return !productIngredientsLower.some(ing => ing.includes('barbecue') || ing.includes('bbq'));
        }
        return !productIngredientsLower.some(ing => ing.includes(extraLower));
      }
      return true;
    });

    return extras;
  }, [product.category, product.ingredients]);

  const currentPrice = useMemo(() => {
    let basePrice = variant === 'menu' && hasMenuOption ? product.menuPrice! : product.price;
    const extrasPrice = addedExtras.reduce((total, extra) => total + extra.price, 0);
    return basePrice + extrasPrice;
  }, [variant, hasMenuOption, product.price, product.menuPrice, addedExtras]);

  const handleToggleIngredient = (ingredient: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleToggleExtra = (extra: Extra) => {
    setAddedExtras(prev =>
      prev.some(e => e.name === extra.name)
        ? prev.filter(e => e.name !== extra.name)
        : [...prev, extra]
    );
  };

  const handleToggleFrySauce = (sauceName: string) => {
    setSelectedFrySauces(prev =>
        prev.includes(sauceName)
            ? prev.filter(s => s !== sauceName)
            : [...prev, sauceName]
    );
  };

  const canAddFrySauces = false;

  const handleAddToCartClick = () => {
    if (((variant === 'menu' && hasMenuOption) || isKidsMenu) && !selectedDrinkId) {
        setDrinkError(true);
        drinkSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setDrinkError(false), 3000);
        return;
    }
    
    const drinkList = isKidsMenu ? KIDS_DRINKS : DRINKS;
    const selectedDrink = drinkList.find(d => d.id === selectedDrinkId);

    const item: Omit<CartItem, 'id' | 'quantity'> = {
        product,
        variant: isKidsMenu ? 'menu' : variant, // Treat Kids menus as a menu variant
        notes: notes,
        removedIngredients,
        addedExtras,
        selectedDrink: ((variant === 'menu' && hasMenuOption) || isKidsMenu) ? selectedDrink : undefined,
        selectedFrySauces: canAddFrySauces ? selectedFrySauces : undefined,
        finalPrice: currentPrice,
    };
    onAddToCart(item, quantity);
    setIsAddedToCart(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const canBeCustomized = (['hamburger', 'american-sandwich', 'sandwich-maiale', 'sandwich-pollo', 'veggy', 'kids-junior', 'box', 'chips'].includes(product.category)) && product.id !== 24 && product.id !== 16;
  const showFrySauceSelector = canAddFrySauces;
  const showDrinkSelector = (variant === 'menu' && hasMenuOption) || isKidsMenu;

  const renderFrySauceSelector = () => (
    <div className="p-4 bg-black/30 rounded-md">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><FriesIcon className="h-6 w-6 text-brand-orange"/>Salse per Patatine (bustine)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FRY_SAUCES.map(sauce => (
                <button key={sauce.name} onClick={() => handleToggleFrySauce(sauce.name)} className={`p-2 rounded-md text-[14.5px] sm:text-sm border ${selectedFrySauces.includes(sauce.name) ? 'bg-brand-orange border-brand-orange text-white font-bold' : 'bg-brand-gray border-white/20 hover:bg-white/10'}`}>
                    {sauce.name}
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <Fragment>
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4"
      >
        <div 
          className="bg-brand-gray rounded-lg shadow-xl max-w-2xl w-full max-h-[98vh] sm:max-h-[90vh] flex flex-col relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`relative bg-brand-gray/50 transition-all duration-300 ${variant === 'menu' ? 'p-1 sm:p-4' : 'p-2 sm:p-4'}`}>
            <button onClick={() => setIsImageZoomed(true)} className="w-full block" aria-label="Visualizza immagine ingrandita">
              <img 
                src={gallery[currentImageIndex]} 
                alt={`${product.name} - ${currentImageIndex + 1}/${gallery.length}`} 
                className={`w-full transition-all duration-300 ${variant === 'menu' ? 'h-20 sm:h-48' : 'h-28 sm:h-48'} ${product.imageFit === 'cover' ? 'object-cover' : 'object-contain'} object-center cursor-pointer`} 
                key={gallery[currentImageIndex]}
              />
            </button>

            {gallery.length > 1 && (
                <>
                    <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10" aria-label="Immagine precedente">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10" aria-label="Immagine successiva">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {gallery.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => handleDotClick(index, e)}
                                className={`w-2 h-2 rounded-full transition-colors ${currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                                aria-label={`Vai a immagine ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                Clicca per ingrandire
            </div>
            <button 
              onClick={onClose} 
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 p-1.5 sm:p-2 rounded-full text-white hover:bg-black/80 transition-colors z-10"
              aria-label="Chiudi modale"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className={`overflow-y-auto scrollbar-hide space-y-2 sm:space-y-4 ${variant === 'menu' ? 'p-2 sm:p-6' : 'p-3 sm:p-6'}`}>
            <h2 className={`font-bold text-white leading-tight ${variant === 'menu' ? 'text-lg sm:text-3xl' : 'text-xl sm:text-3xl'}`}>{product.name}</h2>
            <div className="flex items-baseline gap-2 sm:gap-3">
                <p className="text-brand-orange text-lg sm:text-2xl font-semibold">€{currentPrice.toFixed(2)}</p>
                {variant === 'menu' && (
                    <p className="text-[9px] sm:text-sm text-brand-orange animate-fade-in leading-tight font-medium">Incluso patatine + bibita</p>
                )}
            </div>
            {product.description && mode !== 'quick-menu' && (
              <p className="text-gray-300 text-[12.5px] sm:text-base line-clamp-2 sm:line-clamp-none" dangerouslySetInnerHTML={{ __html: product.description }}></p>
            )}

            {hasMenuOption && mode !== 'quick-menu' && (
              <div className="grid grid-cols-2 gap-2 rounded-md p-1 bg-black/30">
                <button onClick={() => setVariant('panino')} className={`w-full py-2 text-sm rounded transition-all flex items-center justify-center gap-2 ${variant === 'panino' ? 'bg-brand-orange text-white font-bold shadow-md' : 'text-white hover:bg-white/10'}`}>
                  <BurgerIcon className="h-5 w-5" /> Panino
                </button>
                <button onClick={() => { setVariant('menu'); setHighlightDrink(false); setTimeout(() => setHighlightDrink(true), 10); }} className={`w-full py-2 text-sm rounded transition-all flex items-center justify-center gap-2 ${variant === 'menu' ? 'bg-brand-orange text-white font-bold shadow-md' : 'text-white hover:bg-white/10'}`}>
                  <MenuIcon className="h-5 w-5" /> Menù (+€{(product.menuPrice! - product.price).toFixed(2)})
                </button>
              </div>
            )}

            {canBeCustomized && mode !== 'quick-menu' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white -mb-2">
                  {product.category === 'chips' ? 'Personalizza Patatine' : 'Personalizza Panino'}
                </h3>

                {availableExtras.length > 0 && (
                  <details className="rounded-md border border-white/20 overflow-hidden" open>
                        <summary className="p-4 bg-black/20 list-none cursor-pointer flex justify-between items-center group hover:bg-black/40">
                            <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2"><SparklesIcon className="h-5 w-5"/>Aggiungi Extra</h3>
                            <ChevronDownIcon className="h-5 w-5 text-gray-300 group-open:rotate-180 transition-transform"/>
                        </summary>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {availableExtras.map(extra => (
                                <button 
                                  key={extra.name} 
                                  onClick={() => handleToggleExtra(extra)} 
                                  className={`p-2.5 rounded-md text-[14.5px] sm:text-sm border transition-all ${addedExtras.some(e => e.name === extra.name) ? 'bg-brand-orange border-brand-orange text-white font-bold' : 'bg-brand-gray border-white/20 hover:bg-white/10'}`}
                                >
                                    {extra.name} (+€{extra.price.toFixed(2)})
                                </button>
                            ))}
                        </div>
                    </details>
                )}
              </div>
            )}
            
            {(showFrySauceSelector || showDrinkSelector) && (
              <div className="space-y-4">
                  {showFrySauceSelector && renderFrySauceSelector()}
                  {showDrinkSelector && (
                    <div ref={drinkSectionRef} className={`p-2 sm:p-4 bg-black/30 rounded-md border transition-all duration-300 ${highlightDrink ? 'animate-drink-highlight' : 'border-white/10'}`}>
                        <h3 className="text-sm sm:text-lg font-semibold text-white mb-1.5 sm:mb-3 flex items-center gap-2">
                            <DrinkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-brand-orange"/> 
                            Scegli la Bibita
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                            {(isKidsMenu ? KIDS_DRINKS : DRINKS).map(drink => (
                                <button 
                                    key={drink.id} 
                                    onClick={() => setSelectedDrinkId(drink.id)} 
                                    className={`relative flex items-center justify-center p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-all border group overflow-hidden ${selectedDrinkId === drink.id ? 'bg-brand-orange border-brand-orange shadow-lg scale-[1.02]' : 'bg-brand-gray/40 border-white/10 hover:border-brand-orange/30 hover:bg-white/5'}`}
                                >
                                    <span className={`text-[9px] sm:text-xs text-center font-bold uppercase tracking-tight relative z-10 ${selectedDrinkId === drink.id ? 'text-white' : 'text-gray-300'}`}>
                                        {drink.name}
                                    </span>
                                    {selectedDrinkId === drink.id && (
                                        <div className="absolute top-0.5 right-0.5 bg-white text-brand-orange rounded-full p-0.5 shadow-sm z-20">
                                            <CheckCircleIcon className="h-2 w-2 sm:h-3 sm:w-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        {drinkError && <p className="text-red-400 text-[9px] sm:text-xs mt-1 font-medium animate-pulse">Per favore, seleziona una bibita.</p>}
                    </div>
                  )}
              </div>
            )}

            {!product.isDrink &&
              <div className="animate-fade-in">
                  <label htmlFor={`notes-${product.id}`} className="text-sm text-gray-300">Note aggiuntive:</label>
                  <input id={`notes-${product.id}`} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-brand-gray text-white border border-white/20 rounded-md p-2 mt-1 focus:ring-2 focus:ring-brand-orange outline-none" placeholder="Altre richieste..."/>
              </div>
            }
          </div>
          <div className="p-4 sm:p-6 mt-auto border-t border-white/10 bg-black/30 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
              <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} disabled={isAddedToCart} />
              <button 
                onClick={handleAddToCartClick} 
                disabled={isAddedToCart}
                className={`w-full sm:w-auto flex-grow text-white font-bold py-2.5 sm:py-3 px-6 rounded-md transition-colors duration-300 ${
                  isAddedToCart 
                    ? 'bg-green-600 cursor-not-allowed' 
                    : 'bg-brand-orange hover:bg-brand-orange/90'
                }`}
              >
                {isAddedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="h-6 w-6 animate-pop" />
                    Aggiunto!
                  </span>
                ) : (
                  `Aggiungi ${quantity} al Carrello`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isImageZoomed && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setIsImageZoomed(false)}>
          {gallery.length > 1 && (
            <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-[70] focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Immagine precedente"
            >
                <ChevronLeftIcon className="h-8 w-8" />
            </button>
          )}

          <img 
            key={currentImageIndex}
            src={gallery[currentImageIndex]} 
            alt={`Vista ingrandita di ${product.name}`} 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg cursor-default animate-fade-in" 
            onClick={(e) => e.stopPropagation()} 
          />
          
          {gallery.length > 1 && (
            <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-[70] focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Immagine successiva"
            >
                <ChevronRightIcon className="h-8 w-8" />
            </button>
          )}

          <button 
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-5 right-5 text-white p-2 bg-black/50 rounded-full hover:bg-black/80 z-[70]"
            aria-label="Chiudi immagine ingrandita"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default ProductModal;