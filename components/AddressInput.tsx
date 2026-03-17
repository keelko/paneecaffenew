import React, { useState, useEffect, useRef } from 'react';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import arianoIrpinoStreets from './ariano_irpino_streets.json';

interface AddressInputProps {
  city: string;
  setCity: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  houseNumber: string;
  setHouseNumber: (val: string) => void;
  onGetLocation: () => void;
  isLocating: boolean;
  showError?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  city, setCity, street, setStreet, houseNumber, setHouseNumber, onGetLocation, isLocating, showError
}) => {
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);
  const [isSearchingStreet, setIsSearchingStreet] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (street.length < 1 || !showSuggestions) {
      setStreetSuggestions([]);
      return;
    }

    if (city.toLowerCase().trim() === 'ariano irpino') {
      // Use local list for Ariano Irpino for instant, complete autocomplete
      const filtered = arianoIrpinoStreets.filter((s: string) => 
        s.toLowerCase().includes(street.toLowerCase())
      );
      setStreetSuggestions(filtered);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsSearchingStreet(true);
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(street + ' ' + city)}&limit=10`)
        .then(res => res.json())
        .then(data => {
          const streets = data.features
            .map((f: any) => f.properties.name)
            .filter((name: string) => name && name.toLowerCase().includes(street.toLowerCase()));
          setStreetSuggestions([...new Set(streets as string[])]);
          setIsSearchingStreet(false);
        })
        .catch(() => setIsSearchingStreet(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [street, city, showSuggestions]);

  const handleSelectStreet = (selectedStreet: string) => {
    setStreet(selectedStreet);
    setShowSuggestions(false);
  };

  return (
    <div className={`space-y-3 transition-all duration-300 ${showSuggestions && street.length >= 1 ? 'pb-64' : ''}`}>
      <div className="flex flex-col gap-2">
        <button 
          onClick={onGetLocation} 
          disabled={isLocating} 
          className={`w-full p-3 bg-brand-red text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-gray-500 flex items-center justify-center gap-2 transition-all ${showError && !street && !houseNumber ? 'animate-flash-error' : ''}`}
          aria-label="Rileva posizione GPS"
        >
          {isLocating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <LocationMarkerIcon className={`h-5 w-5 ${showError && !street && !houseNumber ? 'animate-bounce' : ''}`}/>}
          Usa la mia posizione attuale
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500 my-1">
            <div className="flex-1 border-b border-gray-200"></div>
            <span>oppure inserisci manualmente</span>
            <div className="flex-1 border-b border-gray-200"></div>
        </div>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">Paese</label>
        <input 
          id="city" 
          type="text" 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          className={`w-full bg-white text-brand-dark border rounded-md p-2 focus:ring-2 focus:ring-brand-red outline-none transition-all ${showError && !city ? 'border-brand-red animate-flash-error' : 'border-brand-red/10'}`} 
          placeholder="Es. Ariano Irpino" 
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 relative" ref={suggestionsRef}>
          <label htmlFor="street" className="block text-sm font-medium text-gray-600 mb-1">Via</label>
          <input 
            id="street" 
            type="text" 
            value={street} 
            onChange={e => {
              setStreet(e.target.value);
              setShowSuggestions(true);
            }} 
            onFocus={() => {
              setShowSuggestions(true);
              // Scroll into view with a small delay to account for keyboard appearance
              setTimeout(() => {
                suggestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 300);
            }}
            className={`w-full bg-white text-brand-dark border rounded-md p-2 focus:ring-2 focus:ring-brand-red outline-none transition-all ${showError && !street ? 'border-brand-red animate-flash-error' : 'border-brand-red/10'}`} 
            placeholder="Es. Via Roma" 
            autoComplete="off"
          />
          {showSuggestions && street.length >= 1 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {isSearchingStreet ? (
                <div className="p-2 text-sm text-gray-500 text-center">Ricerca in corso...</div>
              ) : streetSuggestions.length > 0 ? (
                streetSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectStreet(s)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-brand-red/10 focus:bg-brand-red/10 outline-none transition-colors"
                  >
                    {s}
                  </button>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500 text-center">Nessun suggerimento trovato</div>
              )}
            </div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-600 mb-1">Civico</label>
          <input 
            id="houseNumber" 
            type="text" 
            value={houseNumber} 
            onChange={e => setHouseNumber(e.target.value)} 
            className={`w-full bg-white text-brand-dark border rounded-md p-2 focus:ring-2 focus:ring-brand-red outline-none transition-all ${showError && !houseNumber ? 'border-brand-red animate-flash-error' : 'border-brand-red/10'}`} 
            placeholder="Es. 12" 
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInput;
