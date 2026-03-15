import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Product, CartItem, ProductCategory } from './types';
import { PRODUCTS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav, { CATEGORY_LABELS } from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import Footer from './components/Footer';
import ContactInfo from './components/ContactInfo';
import SearchBar from './components/SearchBar';
import AnimatedBurgerIcon from './components/icons/animated/AnimatedBurgerIcon';
import AnimatedPigIcon from './components/icons/animated/AnimatedPigIcon';
import AnimatedDrinkIcon from './components/icons/animated/AnimatedDrinkIcon';
import AnimatedChickenIcon from './components/icons/animated/AnimatedChickenIcon';
import AnimatedVeggyIcon from './components/icons/animated/AnimatedVeggyIcon';
import AnimatedKidsIcon from './components/icons/animated/AnimatedKidsIcon';
import AnimatedBoxIcon from './components/icons/animated/AnimatedBoxIcon';
import AnimatedChipsIcon from './components/icons/animated/AnimatedChipsIcon';
import AnimatedStarterIcon from './components/icons/animated/AnimatedStarterIcon';
import AnimatedDessertIcon from './components/icons/animated/AnimatedDessertIcon';
import AnimatedCalendarIcon from './components/icons/animated/AnimatedCalendarIcon';
import AnimatedSauceIcon from './components/icons/animated/AnimatedSauceIcon';
import { VISITOR_LOGGER_URL } from './config/visitorLogger';

const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'panini-del-mese': AnimatedCalendarIcon,
  hamburger: AnimatedBurgerIcon,
  'american-sandwich': AnimatedBurgerIcon,
  'sandwich-maiale': AnimatedPigIcon,
  'sandwich-pollo': AnimatedChickenIcon,
  veggy: AnimatedVeggyIcon,
  'kids-junior': AnimatedKidsIcon,
  box: AnimatedBoxIcon,
  chips: AnimatedChipsIcon,
  starter: AnimatedStarterIcon,
  dolci: AnimatedDessertIcon,
  salse: AnimatedSauceIcon,
  drink: AnimatedDrinkIcon,
};

const categoryAnimations: Record<string, string> = {
  'panini-del-mese': 'animate-jiggle',
  hamburger: 'animate-jiggle',
  'american-sandwich': 'animate-pulse-slow',
  'sandwich-maiale': 'animate-jiggle',
  'sandwich-pollo': 'animate-pulse-slow',
  veggy: 'animate-pulse-slow',
  'kids-junior': 'animate-jiggle',
  box: 'animate-pulse-slow',
  chips: 'animate-jiggle',
  starter: 'animate-pulse-slow',
  dolci: 'animate-jiggle',
  salse: 'animate-pulse-slow',
  drink: 'animate-pulse-slow',
};

/**
 * Genera un ID univoco per un articolo del carrello basato sulla sua configurazione.
 * Questo assicura che articoli identici vengano raggruppati.
 */
const generateCartItemId = (item: Omit<CartItem, 'id' | 'quantity'>): string => {
    const parts: string[] = [
        `p_${item.product.id}`,
        `v_${item.variant}`,
    ];

    if (item.removedIngredients.length > 0) {
        parts.push(`r_${[...item.removedIngredients].sort().join(',')}`);
    }
    if (item.addedExtras.length > 0) {
        parts.push(`a_${[...item.addedExtras].map(e => e.name).sort().join(',')}`);
    }
    if (item.selectedDrink) {
        parts.push(`d_${item.selectedDrink.id}`);
    }
    if (item.selectedFrySauces && item.selectedFrySauces.length > 0) {
        parts.push(`s_${[...item.selectedFrySauces].sort().join(',')}`);
    }
    if (item.notes.trim()) {
        parts.push(`n_${item.notes.trim()}`);
    }

    return parts.join('|');
}

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('paneECaffeCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<CartItemVariant>('panino');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('panini-del-mese');
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const logVisit = () => {
        if (!VISITOR_LOGGER_URL || VISITOR_LOGGER_URL.includes('INCOLLA_QUI')) {
            console.warn("URL per il logging delle visite non configurato. Salto la registrazione.");
            return;
        }
        try {
            const thirtyMinutes = 30 * 60 * 1000;
            const lastVisit = localStorage.getItem('paneECaffeLastVisit');
            const now = new Date().getTime();
            if (lastVisit && (now - parseInt(lastVisit, 10)) < thirtyMinutes) {
                return;
            }
            fetch(VISITOR_LOGGER_URL, {
                method: 'POST',
                mode: 'no-cors'
            }).catch(error => {});
            localStorage.setItem('paneECaffeLastVisit', now.toString());
        } catch (error) {
            console.error("Errore durante la registrazione della visita:", error);
        }
    };
    logVisit();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('paneECaffeCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Could not save cart to localStorage", error);
    }
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
        return PRODUCTS;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.description.toLowerCase().includes(lowerCaseQuery) ||
        (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(lowerCaseQuery)))
    );
  }, [searchQuery]);


  const productsByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts]);

  const orderedCategories = useMemo(() => {
    const order: ProductCategory[] = ['panini-del-mese', 'hamburger', 'american-sandwich', 'sandwich-maiale', 'sandwich-pollo', 'veggy', 'kids-junior', 'box', 'chips', 'starter', 'dolci', 'salse', 'drink'];
    return order.filter(cat => productsByCategory[cat] && productsByCategory[cat].length > 0);
  }, [productsByCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (isScrollingRef.current) return;

            const visibleEntries = entries.filter(entry => entry.isIntersecting);

            if (visibleEntries.length > 0) {
                visibleEntries.sort((a, b) => {
                    return a.boundingClientRect.top - b.boundingClientRect.top;
                });
                
                setActiveCategory(visibleEntries[0].target.id as ProductCategory);
            }
        },
        { 
          rootMargin: '-140px 0px -40% 0px', 
          threshold: 0.01 
        }
    );

    orderedCategories.forEach(cat => {
        const section = sectionRefs.current[cat];
        if (section) {
            observer.observe(section);
        }
    });

    return () => {
        orderedCategories.forEach(cat => {
            const section = sectionRefs.current[cat];
            if (section) {
                observer.unobserve(section);
            }
        });
    };
  }, [orderedCategories]);

  const handleSelectCategory = useCallback((category: ProductCategory | 'contatti') => {
    isScrollingRef.current = true;
    const targetId = category;

    if (category !== 'contatti') {
        setActiveCategory(category as ProductCategory);
    }

    setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
    
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  }, []);


  useEffect(() => {
      return () => clearTimeout(scrollTimeoutRef.current);
  }, []);

  const handleAddToCart = useCallback((item: Omit<CartItem, 'id' | 'quantity'>, quantity: number) => {
    const itemId = generateCartItemId(item);

    setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.id === itemId);

        if (existingItem) {
            return prevItems.map(i =>
                i.id === itemId
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
            );
        } else {
            const newItem: CartItem = {
                ...item,
                id: itemId,
                quantity: quantity,
            };
            return [...prevItems, newItem];
        }
    });

    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);
  }, []);
  
  const handleUpdateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== itemId);
      }
      return prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const [selectedMode, setSelectedMode] = useState<'quick-menu' | 'full-customize'>('full-customize');

  const handleViewDetails = useCallback((product: Product, initialVariant: CartItemVariant = 'panino', mode: 'quick-menu' | 'full-customize' = 'full-customize') => {
    setSelectedProduct(product);
    setSelectedVariant(initialVariant);
    setSelectedMode(mode);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);
  
  const handleCartClick = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const handleToggleSearch = useCallback(() => {
    setIsSearchActive(prev => {
        const nextState = !prev;
        if (nextState) {
            // When activating search, scroll to the nav bar and focus the input
            const navElement = document.getElementById('category-nav-container');
            if (navElement) {
                navElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Delay focus slightly to allow for CSS transition
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 300); // Should match the transition duration
        } else {
            // When deactivating, clear the query
            setSearchQuery('');
        }
        return nextState;
    });
  }, []);

  const handleScrollToTop = useCallback(() => {
    isScrollingRef.current = true;
    setActiveCategory('panini-del-mese');

    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 0);

    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
    }, 1000);
  }, []);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);
  
  useEffect(() => {
      if (isCartOpen || selectedProduct) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'auto';
      }
      return () => {
          document.body.style.overflow = 'auto';
      };
  }, [isCartOpen, selectedProduct]);

  return (
    <div className="bg-brand-dark text-brand-cream min-h-screen font-sans">
      <Header 
        cartItemCount={cartItemCount} 
        onCartClick={handleCartClick} 
        onScrollToTop={handleScrollToTop}
        isCartAnimating={isCartAnimating}
      />
      <main>
        {!isSearchActive && <Hero />}
        <div id="category-nav-container" className="sticky top-20 z-30 bg-brand-dark/90 backdrop-blur-sm shadow-md">
            <CategoryNav
                categories={orderedCategories}
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
                onSearchClick={handleToggleSearch}
            />
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSearchActive ? 'max-h-40' : 'max-h-0'}`}>
              <div className="container mx-auto px-4">
                  <SearchBar ref={searchInputRef} query={searchQuery} onQueryChange={setSearchQuery} />
              </div>
            </div>
        </div>
        <div className="container mx-auto px-4 py-8 pt-4 space-y-16">
            {orderedCategories.length > 0 ? (
                orderedCategories.map(category => {
                    const Icon = categoryIcons[category];
                    const animationClass = categoryAnimations[category] || '';
                    const isSimpleCategory = category === 'salse' || category === 'drink';
                    const isMonthlySpecial = category === 'panini-del-mese';
                    return (
                        <section 
                            key={category} 
                            id={category} 
                            ref={el => { sectionRefs.current[category] = el; }}
                            className="scroll-mt-36"
                        >
                            <div className={isMonthlySpecial ? 'bg-gradient-to-br from-brand-orange to-orange-600 p-6 rounded-2xl shadow-2xl relative overflow-hidden' : ''}>
                                {isMonthlySpecial && (
                                    <>
                                        <div 
                                            className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 animate-flash-opacity pointer-events-none z-0 overflow-hidden"
                                        >
                                            <div 
                                                className="w-full h-full"
                                                style={{ 
                                                    backgroundImage: 'url(https://i.imgur.com/BTUtA65.png)',
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right center',
                                                    mixBlendMode: 'soft-light'
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                                <h2 className={`text-3xl font-bold mb-6 border-b-2 pb-2 flex items-center gap-3 relative z-10 ${isMonthlySpecial ? 'text-brand-dark border-black/20' : 'text-brand-orange border-white/10'}`}>
                                    {Icon && <Icon className={`h-10 w-10 ${animationClass}`} />}
                                    <span>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}</span>
                                </h2>
                                <div className={`grid gap-6 relative z-10 ${isSimpleCategory ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                    {(productsByCategory[category] || []).map(product => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={product} 
                                            onAddToCart={handleAddToCart} 
                                            onViewDetails={handleViewDetails}
                                            isSpecial={isMonthlySpecial}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )
                })
            ) : (
                <div className="text-center py-16">
                    <p className="text-2xl font-bold text-gray-400">Nessun prodotto trovato</p>
                    <p className="text-gray-500 mt-2">Prova a modificare i termini della tua ricerca.</p>
                </div>
            )}
        </div>
        <ContactInfo />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal 
            product={selectedProduct}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
            initialVariant={selectedVariant}
            mode={selectedMode}
        />
      )}
      {isCartOpen && (
        <CartModal
            isOpen={isCartOpen}
            onClose={handleCartClick}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
        />
      )}
    </div>
  );
};

export default App;