import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProductCategory } from '../types';
import AnimatedCalendarIcon from './icons/animated/AnimatedCalendarIcon';
import SearchIcon from './icons/SearchIcon';

interface CategoryNavProps {
    categories: ProductCategory[];
    activeCategory: ProductCategory;
    onSelectCategory: (category: ProductCategory | 'contatti') => void;
    onSearchClick: () => void;
}

export const CATEGORY_LABELS: Record<string, string> = {
    'panini-del-mese': 'Panini del Mese',
    'hamburger': 'Burgers & Smash',
    'sandwich-pollo': 'Sandwiches di Pollo',
    'veggy': 'Vegetariano',
    'chips': 'Chips',
    'starter': 'Starter',
    'box': 'Box',
    'dolci': 'Dolci',
    'salse': 'Le Nostre Salse',
    'drink': 'Bibite',
};

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategory, onSelectCategory, onSearchClick }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    const displayCategories = useMemo(() => {
        return categories;
    }, [categories]);
    
    useEffect(() => {
        const activeButton = buttonRefs.current[activeCategory];
        
        if (activeButton) {
            const { offsetLeft, offsetWidth } = activeButton;
            
            setIndicatorStyle({
                left: offsetLeft,
                width: offsetWidth,
                opacity: 1,
            });

            activeButton.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [activeCategory, categories]);


    return (
        <nav className="border-b border-brand-orange/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div 
                        ref={scrollContainerRef}
                        className="relative flex space-x-1 sm:space-x-4 overflow-x-auto py-3 scrollbar-hide"
                    >
                        <div 
                            className="absolute bg-brand-orange rounded-full transition-all duration-300 ease-in-out"
                            style={{
                                ...indicatorStyle,
                                top: '0.375rem',
                                bottom: '0.375rem',
                                height: 'auto'
                            }}
                            aria-hidden="true"
                        />

                        {displayCategories.map(category => {
                            const isMonthlySpecial = category === 'panini-del-mese';
                            const isActive = activeCategory === category;
                            const textClass = isActive ? 'text-white' : (isMonthlySpecial ? 'text-brand-orange' : 'text-brand-cream');

                            return (
                                <button
                                    key={category}
                                    ref={el => { buttonRefs.current[category] = el; }}
                                    onClick={() => onSelectCategory(category)}
                                    className="relative px-3 sm:px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-300 flex items-center gap-2 z-10"
                                >
                                    {isMonthlySpecial && <AnimatedCalendarIcon className={`h-4 w-4 ${textClass} transition-colors duration-300`} />}
                                    <span className={`${textClass} transition-colors duration-300`}>{CATEGORY_LABELS[category] || category}</span>
                                </button>
                            );
                        })}
                         <button
                            onClick={() => onSelectCategory('contatti')}
                            className="relative px-3 sm:px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-300 text-brand-orange hover:text-brand-orange/90 z-10"
                        >
                            Contatti
                        </button>
                    </div>
                    <div className="flex-shrink-0 flex items-center pl-2">
                        <button
                            onClick={onSearchClick}
                            className="relative flex-shrink-0 pl-2 text-brand-orange hover:text-brand-orange/90 z-10"
                            aria-label="Cerca prodotti"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CategoryNav;