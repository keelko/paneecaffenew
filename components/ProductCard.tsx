import React, { useState } from 'react';
import { Product, CartItem, ProductVariant } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import SmallSauceIcon from './icons/SmallSauceIcon';
import LargeSauceIcon from './icons/LargeSauceIcon';
import PlusIcon from './icons/PlusIcon';
import SettingsIcon from './icons/SettingsIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>, quantity: number) => void;
  onViewDetails: (product: Product, initialVariant?: CartItemVariant, mode?: 'quick-menu' | 'full-customize') => void;
  isSpecial?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails, isSpecial = false }) => {
  const [isAdded, setIsAdded] = useState<string | boolean>(false);
  const hasMenuOption = product.menuPrice !== undefined;
  // Chicken Box (id 24) is not customizable
  const isCustomizable = (['hamburger', 'sandwich-maiale', 'sandwich-pollo', 'veggy', 'panini-del-mese', 'kids-junior', 'box', 'american-sandwich', 'chips', 'starter'].includes(product.category)) && product.id !== 24;
  const isSimple = !!product.isDrink;

  const currentDay = new Date().getDay();
  
  const isAvailable = product.availableDays ? product.availableDays.includes(currentDay) : true;
  const unavailableMessage = "Solo sabato e domenica";

  const handleQuickAddDefault = () => {
    onAddToCart({
        product,
        notes: '',
        variant: 'panino',
        removedIngredients: [],
        addedExtras: [],
        finalPrice: product.price,
    }, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleQuickAddVariant = (variant: ProductVariant) => {
    onAddToCart({
        product,
        notes: `Formato: ${variant.name}`,
        variant: 'panino',
        removedIngredients: [],
        addedExtras: [],
        finalPrice: variant.price,
    }, 1);
    setIsAdded(variant.name);
    setTimeout(() => setIsAdded(false), 1000);
  };

  if (isSimple) {
    return (
        <div 
          className={`bg-brand-gray rounded-lg p-4 shadow-lg flex justify-between items-center h-full ${!isAvailable ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          title={!isAvailable ? unavailableMessage : undefined}
        >
            <div className="pr-4">
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-gray-400 text-[14.5px]" dangerouslySetInnerHTML={{ __html: product.description }}></p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-brand-orange text-xl font-semibold mb-2">
                    €{product.price.toFixed(2)}
                </p>
                <button
                    onClick={isAvailable ? handleQuickAddDefault : undefined}
                    disabled={!!isAdded || !isAvailable}
                    className={`font-bold py-1 px-3 rounded-md transition-colors duration-300 text-sm disabled:cursor-not-allowed flex items-center gap-1 ${
                        isAdded 
                        ? 'bg-green-600 text-white' 
                        : 'bg-brand-orange text-white hover:bg-brand-orange/90'
                    } ${!isAvailable ? 'bg-gray-500' : ''}`}
                >
                    {isAdded ? (
                        <>
                            <CheckCircleIcon className="h-4 w-4 animate-pop" />
                            <span>Aggiunto!</span>
                        </>
                    ) : (
                        'Aggiungi'
                    )}
                </button>
            </div>
        </div>
    );
  }

  // Determine button layout for complex cards
  const requiresModal = product.category === 'kids-junior';
  const showTwoButtons = (isCustomizable || hasMenuOption) && !requiresModal && !product.variants;
  
  const cardClasses = isSpecial ? "bg-brand-cream text-brand-dark" : "bg-brand-gray";
  const titleClasses = isSpecial ? "text-brand-dark" : "text-white";
  const descriptionClasses = isSpecial ? "text-gray-700" : "text-gray-400";
  const menuPriceClasses = isSpecial ? "text-gray-600 font-medium" : "text-white font-normal";
  const quickAddBtnClasses = isSpecial 
    ? "bg-white/60 text-brand-dark border-brand-dark/30 hover:bg-white disabled:bg-green-600 disabled:text-white disabled:border-green-500"
    : "bg-black/20 text-white border-brand-orange hover:bg-black/40 disabled:bg-green-600 disabled:border-green-500";
  const personalizeBtnClasses = isSpecial
    ? "bg-brand-dark text-white hover:bg-black rounded-full text-[11px] uppercase tracking-widest shadow-sm"
    : "bg-brand-orange text-white hover:bg-brand-orange/90 rounded-full text-[11px] uppercase tracking-widest shadow-sm";

  const variantBtnClasses = isSpecial 
    ? "bg-gray-300 hover:bg-gray-400 text-brand-dark" 
    : "bg-gray-200 hover:bg-gray-300 text-brand-dark";

  return (
    <div 
      className={`relative rounded-lg overflow-hidden shadow-lg group flex flex-col ${cardClasses} ${!isAvailable ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
      title={!isAvailable ? unavailableMessage : undefined}
    >
      {isSpecial && (
        <>
            {/* TOP: Animates left-to-right */}
            <span className="absolute top-0 left-0 h-[1px] w-0 bg-brand-dark transition-all duration-200 ease-linear group-hover:w-full" />
            {/* RIGHT: Animates top-to-bottom */}
            <span className="absolute top-0 right-0 w-[1px] h-0 bg-brand-dark transition-all duration-200 ease-linear delay-200 group-hover:h-full" />
            {/* BOTTOM: Animates right-to-left */}
            <span className="absolute bottom-0 right-0 h-[1px] w-0 bg-brand-dark transition-all duration-200 ease-linear delay-[400ms] group-hover:w-full" />
            {/* LEFT: Animates bottom-to-top */}
            <span className="absolute bottom-0 left-0 w-[1px] h-0 bg-brand-dark transition-all duration-200 ease-linear delay-[600ms] group-hover:h-full" />
        </>
      )}
      <div className={`relative overflow-hidden p-4 ${isAvailable ? 'cursor-pointer' : ''}`} onClick={() => isAvailable && onViewDetails(product)}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-40 ${product.imageFit === 'cover' ? 'object-cover' : 'object-contain'} ${isAvailable ? 'group-hover:scale-110' : ''} transition-transform duration-500 ease-in-out`} 
            style={{ objectPosition: product.imagePosition || 'center' }}
          />
          {isAvailable && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <p className="text-white font-bold text-lg border-2 border-white rounded-full px-4 py-2">Dettagli</p>
            </div>
          )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-xl font-bold ${titleClasses}`}>{product.name}</h3>
        <p className={`mt-1 text-[14.5px] flex-grow ${descriptionClasses}`} dangerouslySetInnerHTML={{ __html: product.description }}></p>
        
        <div className="mt-auto pt-4">
            {hasMenuOption ? (
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (!isAvailable) return;
                                handleQuickAddDefault();
                            }}
                            disabled={!!isAdded || !isAvailable}
                            className={`flex-1 flex flex-col justify-center items-center p-2 border rounded-md transition-colors ${
                                isAdded 
                                ? 'bg-green-600 border-green-600 text-white' 
                                : (isSpecial ? 'border-brand-dark/30 hover:bg-brand-dark/10 bg-white/50' : 'border-brand-orange/50 hover:bg-brand-orange/20 bg-black/20')
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span className={`text-sm font-semibold flex items-center gap-1 ${isSpecial && !isAdded ? 'text-brand-dark' : 'text-white'}`}>
                                {isAdded && <CheckCircleIcon className="h-4 w-4 animate-pop" />}
                                {isAdded ? 'Aggiunto!' : 'Solo Panino'}
                            </span>
                            <span className={`${isAdded ? 'text-white/90' : 'text-brand-orange'} font-bold text-lg`}>€{product.price.toFixed(2)}</span>
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); isAvailable && onViewDetails(product, 'menu', 'quick-menu'); }}
                            disabled={!isAvailable}
                            className={`flex-1 flex flex-col justify-center items-center p-2 border rounded-md transition-colors ${isSpecial ? 'border-brand-dark/30 hover:bg-brand-dark/10 bg-white/50' : 'border-brand-orange/50 hover:bg-brand-orange/20 bg-black/20'} disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                        >
                            <span className={`text-sm font-semibold ${isSpecial ? 'text-brand-dark' : 'text-white'}`}>Menù</span>
                            <span className="text-brand-orange font-bold text-lg">€{product.menuPrice!.toFixed(2)}</span>
                            <span className={`text-[10px] leading-tight text-center mt-1 px-1 ${isSpecial ? 'text-gray-600' : 'text-gray-400'}`}>+ patatine e bibita</span>
                        </button>
                    </div>
                    {isCustomizable ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); isAvailable && onViewDetails(product, 'panino', 'full-customize'); }}
                            disabled={!isAvailable}
                            className={`w-fit mx-auto px-4 py-1 text-[10px] uppercase tracking-wider rounded-full transition-all border flex items-center gap-1.5 ${isSpecial ? 'border-brand-dark/30 text-brand-dark/70 hover:bg-brand-dark hover:text-white' : 'border-white/20 text-gray-400 hover:border-brand-orange hover:text-brand-orange'} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <SettingsIcon className="h-3 w-3" />
                            <span>Personalizza</span>
                        </button>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); isAvailable && onViewDetails(product, 'panino', 'full-customize'); }}
                            disabled={!isAvailable}
                            className={`w-fit mx-auto px-4 py-1 text-[10px] uppercase tracking-wider rounded-full transition-all border flex items-center gap-1.5 ${isSpecial ? 'border-brand-dark/30 text-brand-dark/70 hover:bg-brand-dark hover:text-white' : 'border-white/20 text-gray-400 hover:border-brand-orange hover:text-brand-orange'} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <SettingsIcon className="h-3 w-3" />
                            <span>Personalizza</span>
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            {product.variants && product.variants.length > 0 ? (
                                <div className="text-brand-orange text-2xl font-semibold flex items-baseline gap-x-4">
                                    {product.variants.map((v) => (
                                        <div key={v.name}>
                                            <span>€{v.price.toFixed(2)}</span>
                                            <span className={`text-sm ml-1 font-normal capitalize ${isSpecial ? 'text-gray-600' : 'text-gray-400'}`}>{v.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-brand-orange text-2xl font-semibold">
                                    €{product.price.toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {showTwoButtons ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-stretch gap-2 w-full">
                                <button
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (isAvailable && !isAdded) handleQuickAddDefault(); 
                                    }}
                                    disabled={!!isAdded || !isAvailable}
                                    className={`flex-grow font-bold py-2.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${isAdded ? 'bg-green-600 text-white' : (isSpecial ? 'bg-brand-dark text-white' : 'bg-brand-orange text-white')} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isAdded ? <CheckCircleIcon className="h-5 w-5" /> : <ShoppingCartIcon className="h-5 w-5" />}
                                    <span>{isAdded ? 'Aggiunto!' : 'Aggiungi'}</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); isAvailable && onViewDetails(product); }}
                                    disabled={!isAvailable}
                                    className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 h-11 rounded-md border transition-all duration-300 ${isSpecial ? 'border-brand-dark/30 text-brand-dark hover:bg-brand-dark/10' : 'border-white/20 text-gray-400 hover:border-brand-orange hover:text-brand-orange'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <SettingsIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Personalizza</span>
                                </button>
                            </div>
                        </div>
                    ) : (product.variants && product.variants.length > 0) ? (
                        <div className="flex items-stretch gap-2">
                            {product.variants.map(variant => {
                                const isSmall = variant.name === 'Small';
                                const isVariantAdded = isAdded === variant.name;
                                const sizeTextColor = isSmall ? 'text-gray-700' : 'text-black';

                                return (
                                    <button
                                        key={variant.name}
                                        onClick={() => isAvailable && handleQuickAddVariant(variant)}
                                        disabled={isVariantAdded || !isAvailable}
                                        className={`flex-grow font-bold py-2 px-3 rounded-md transition-colors duration-300 text-sm flex items-center justify-center gap-2 ${isVariantAdded ? 'bg-green-600 text-white' : variantBtnClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isVariantAdded ? (
                                            <>
                                                <CheckCircleIcon className="h-4 w-4 animate-pop" />
                                                <span>Aggiunto!</span>
                                            </>
                                        ) : (
                                            <>
                                                {isSmall ? <SmallSauceIcon className={`h-5 w-5 ${sizeTextColor}`} /> : <LargeSauceIcon className={`h-5 w-5 ${sizeTextColor}`} />}
                                                <span>
                                                    <span className={`${sizeTextColor} font-extrabold`}>{variant.name}</span> Aggiungi
                                                </span>
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (!isAvailable) return;
                                if (requiresModal || isCustomizable) {
                                    onViewDetails(product);
                                } else {
                                    handleQuickAddDefault();
                                }
                            }}
                            disabled={(!!isAdded && !isCustomizable) || !isAvailable}
                            className={`w-fit mx-auto font-bold py-2 px-8 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                                isAdded && !isCustomizable 
                                ? 'bg-green-600 text-white' 
                                : (isCustomizable ? personalizeBtnClasses : 'bg-brand-orange text-white hover:bg-brand-orange/90')
                            } ${!isAvailable ? 'bg-gray-500' : ''}`}
                        >
                            {isAdded && !isCustomizable ? (
                                <CheckCircleIcon className="h-5 w-5 animate-pop" />
                            ) : (
                                isCustomizable && <SettingsIcon className="h-4 w-4" />
                            )}
                            <span>{isCustomizable ? 'Personalizza' : (isAdded ? 'Aggiunto!' : 'Aggiungi')}</span>
                        </button>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;