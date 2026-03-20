import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const fullMedia = [
    { type: 'video', url: 'https://i.imgur.com/jx9rIus.mp4', duration: 12000 },
    { type: 'image', url: 'https://i.imgur.com/Dq7bbAB.png', duration: 11000 },
    { type: 'image', url: 'https://i.imgur.com/obCBQLR.png', duration: 8000 }
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const media = useMemo(() => {
    let currentMedia = [...fullMedia];
    
    if (isMobile) {
      currentMedia = currentMedia.map((item, index) => {
        // Sostituisci la prima immagine (indice 1 nel fullMedia) solo su mobile
        if (index === 1 && item.type === 'image') {
          return { ...item, url: 'https://i.imgur.com/cSKbUTZ.png' };
        }
        // Sostituisci la seconda immagine (indice 2 nel fullMedia) solo su mobile
        if (index === 2 && item.type === 'image') {
          return { ...item, url: 'https://i.imgur.com/FlVrm73.png' };
        }
        return item;
      });
    }

    // Controlla se l'API Network Information è disponibile
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      // Condizioni per una connessione lenta o per il risparmio dati attivo
      const isSlowConnection =
        connection.saveData === true ||
        ['slow-2g', '2g'].includes(connection.effectiveType);

      if (isSlowConnection) {
        // Se la connessione è lenta, filtra il video
        return currentMedia.filter(item => item.type !== 'video');
      }
    }
    // Altrimenti, restituisce tutti i media
    return currentMedia;
  }, [isMobile]);


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
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <video
                        className="w-full h-full object-cover"
                        src={item.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
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