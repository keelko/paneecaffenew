import React, { useState } from 'react';
import { Product, CartItem, ProductVariant } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import SmallSauceIcon from './icons/SmallSauceIcon';
import LargeSauceIcon from './icons/LargeSauceIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  isSpecial?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails, isSpecial = false }) => {
  const [isAdded, setIsAdded] = useState<string | boolean>(false);
  const hasMenuOption = product.menuPrice !== undefined;
  // Chicken Box (id 24) is not customizable
  const isCustomizable = (['hamburger', 'sandwich-maiale', 'sandwich-pollo', 'veggy', 'panini-del-mese', 'kids-junior', 'box', 'american-sandwich'].includes(product.category)) && product.id !== 24;
  const isSimple = !!product.isDrink;

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
        <div className="bg-brand-gray rounded-lg p-4 shadow-lg flex justify-between items-center h-full">
            <div className="pr-4">
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-brand-orange text-xl font-semibold mb-2">
                    €{product.price.toFixed(2)}
                </p>
                <button
                    onClick={handleQuickAddDefault}
                    disabled={!!isAdded}
                    className="bg-brand-orange text-white font-bold py-1 px-3 rounded-md hover:bg-brand-orange/90 transition-colors duration-300 text-sm disabled:bg-green-600"
                >
                    {isAdded ? 'Aggiunto!' : 'Aggiungi'}
                </button>
            </div>
        </div>
    );
  }

  // Determine button layout for complex cards
  const requiresModal = product.category === 'kids-junior' || (product.category === 'box' && product.id !== 24);
  const showTwoButtons = (isCustomizable || hasMenuOption) && !requiresModal && !product.variants;
  
  const cardClasses = isSpecial ? "bg-brand-cream text-brand-dark" : "bg-brand-gray";
  const titleClasses = isSpecial ? "text-brand-dark" : "text-white";
  const descriptionClasses = isSpecial ? "text-gray-700" : "text-gray-400";
  const menuPriceClasses = isSpecial ? "text-gray-600 font-medium" : "text-white font-normal";
  const quickAddBtnClasses = isSpecial 
    ? "bg-white/60 text-brand-dark border-brand-dark/30 hover:bg-white disabled:bg-green-600 disabled:text-white disabled:border-green-500"
    : "bg-black/20 text-white border-brand-orange hover:bg-black/40 disabled:bg-green-600 disabled:border-green-500";
  const personalizeBtnClasses = isSpecial
    ? "bg-brand-dark text-white hover:bg-black"
    : "bg-brand-orange text-white hover:bg-brand-orange/90";

  const variantBtnClasses = isSpecial 
    ? "bg-gray-300 hover:bg-gray-400 text-brand-dark" 
    : "bg-gray-200 hover:bg-gray-300 text-brand-dark";

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg group flex flex-col ${cardClasses}`}>
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
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-48 ${product.imageFit === 'contain' ? 'object-contain' : 'object-cover'} group-hover:scale-110 transition-transform duration-500 ease-in-out`} 
            style={{ objectPosition: product.imagePosition || 'center' }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <p className="text-white font-bold text-lg border-2 border-white rounded-full px-4 py-2">Dettagli</p>
          </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-xl font-bold ${titleClasses}`}>{product.name}</h3>
        <p className={`mt-1 text-sm flex-grow ${descriptionClasses}`}>{product.description}</p>
        
        <div className="mt-auto pt-4">
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
                            {hasMenuOption && (
                                 <span className={`text-base ml-2 ${menuPriceClasses}`}>/ Menù €{product.menuPrice!.toFixed(2)}</span>
                            )}
                        </p>
                    )}
                </div>
            </div>
            
            {showTwoButtons ? (
                 <div className="flex items-stretch gap-2">
                    <button
                        onClick={handleQuickAddDefault}
                        disabled={!!isAdded}
                        className={`p-2 rounded-md transition-all duration-300 w-14 flex-shrink-0 flex justify-center items-center border ${quickAddBtnClasses}`}
                        aria-label="Aggiungi rapidamente al carrello"
                    >
                        {isAdded ? <CheckCircleIcon className="h-6 w-6" /> : <ShoppingCartIcon className="h-6 w-6" />}
                    </button>
                    <button
                        onClick={() => onViewDetails(product)}
                        className={`flex-grow font-bold py-2 px-4 rounded-md transition-colors duration-300 ${personalizeBtnClasses}`}
                    >
                        Personalizza
                    </button>
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
                                onClick={() => handleQuickAddVariant(variant)}
                                disabled={isVariantAdded}
                                className={`flex-grow font-bold py-2 px-3 rounded-md transition-colors duration-300 text-sm flex items-center justify-center gap-2 ${isVariantAdded ? 'bg-green-600 text-white' : variantBtnClasses}`}
                            >
                                {isVariantAdded ? (
                                    'Aggiunto!'
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
                        if (requiresModal || isCustomizable || hasMenuOption) {
                            onViewDetails(product);
                        } else {
                            handleQuickAddDefault();
                        }
                    }}
                    disabled={!!isAdded && !isCustomizable && !hasMenuOption}
                    className={`w-full font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-green-600 ${isCustomizable || hasMenuOption ? personalizeBtnClasses : 'bg-brand-orange text-white hover:bg-brand-orange/90'}`}
                >
                    {isCustomizable || hasMenuOption ? 'Personalizza' : (isAdded ? 'Aggiunto!' : 'Aggiungi')}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;