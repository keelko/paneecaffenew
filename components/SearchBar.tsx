import React, { forwardRef } from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ query, onQueryChange }, ref) => {
    return (
        <div className="relative my-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
                ref={ref}
                type="search" 
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Cerca un panino, un ingrediente..."
                className="w-full bg-brand-gray text-white border border-white/20 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-orange transition-all duration-300 placeholder-gray-500"
                aria-label="Cerca prodotti"
            />
        </div>
    );
});

export default SearchBar;
