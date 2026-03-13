import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const fullMedia = [
    { type: 'video', url: 'https://i.imgur.com/jx9rIus.mp4', duration: 12000 },
    { type: 'image', url: 'https://i.imgur.com/Dq7bbAB.png', duration: 11000 },
    { type: 'image', url: 'https://i.imgur.com/obCBQLR.png', duration: 8000 }
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);

  const media = useMemo(() => {
    // Controlla se l'API Network Information è disponibile
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      // Condizioni per una connessione lenta o per il risparmio dati attivo
      const isSlowConnection =
        connection.saveData === true ||
        ['slow-2g', '2g'].includes(connection.effectiveType);

      if (isSlowConnection) {
        // Se la connessione è lenta, filtra il video
        return fullMedia.filter(item => item.type !== 'video');
      }
    }
    // Altrimenti, restituisce tutti i media
    return fullMedia;
  }, []);


  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % media.length);
  }, [media.length]);

  useEffect(() => {
    if (media.length === 0) return;
    
    const imageTimer = setTimeout(() => {
        goToNext();
    }, media[currentIndex].duration);

    return () => {
        clearTimeout(imageTimer);
    };
  }, [currentIndex, goToNext, media]);


  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEnd;
    const swipeThreshold = 50; // Distanza minima per uno swipe

    if (distance > swipeThreshold) { // Swipe a sinistra
      goToNext();
    } else if (distance < -swipeThreshold) { // Swipe a destra
      setCurrentIndex(prev => (prev - 1 + media.length) % media.length);
    }

    touchStartRef.current = null;
  };
  
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
        className="relative h-64 md:h-80 w-full overflow-hidden shadow-lg touch-pan-y bg-black"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
      {media.map((item, index) => {
        const isActive = currentIndex === index;
        if (item.type === 'video') {
            return (
                <video
                    key={index}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    src={item.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            );
        }
        return (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat saturate-100 transition-opacity duration-2000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `url(${item.url})`,
                animation: isActive ? `subtle-zoom ${item.duration}ms ease-out forwards` : 'none',
              }}
            />
        );
      })}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Text Overlay for the first slide */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center text-brand-cream pointer-events-none transition-opacity duration-1000 ease-in-out ${currentIndex === 0 && media[0]?.type === 'video' ? 'opacity-100' : 'opacity-0'}`}>
        <div>
            <h1 className="font-brand text-4xl md:text-7xl tracking-wider animate-hero-title-fade" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.6)' }}>
                Pane & Caffè
            </h1>
            <p className="font-bold tracking-[0.2em] uppercase text-xs md:text-xl mt-2 animate-hero-subtitle-fade" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Laboratorio di Hamburger
            </p>
            <div className="bg-brand-orange h-1 w-2/5 mt-4 mx-auto origin-left animate-hero-bar-animation"></div>
        </div>
      </div>
      
      {/* Text Overlay for the second slide */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center text-brand-cream pointer-events-none transition-opacity duration-1000 ease-in-out ${currentIndex === (media.some(m => m.type === 'video') ? 1 : 0) ? 'opacity-100' : 'opacity-0'}`}>
          <div>
              <div className="bg-brand-orange h-1 w-2/5 mb-4 mx-auto origin-left animate-hero-bar-animation" style={{ animationDuration: '11s' }}></div>
              <h2 
                className="font-brand text-3xl md:text-6xl tracking-wider shine-effect-once opacity-75" 
                style={{ textShadow: '0 3px 6px rgba(0,0,0,0.6)' }}
              >
                Vieni a scoprire i nostri panini
              </h2>
              <p 
                className="font-semibold tracking-[0.1em] uppercase text-xs md:text-lg mt-4 animate-pulse-slow opacity-75"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                Creati con passione!
              </p>
          </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {media.map((_, index) => (
            <button
                key={index}
                onClick={() => handleDotClick(index)}
                aria-label={`Vai alla slide ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/75'}`}
            />
        ))}
      </div>
    </div>
  );
};

export default Hero;