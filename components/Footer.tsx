import React from 'react';
import { RESTAURANT_ADDRESS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-red/5 border-t border-brand-red/10">
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="mb-4">
            <p className="font-bold text-lg text-brand-dark">Pane & Caffè</p>
            <p><a href="https://www.panecaffe.info/" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Sito Ufficiale</a></p>
            <p>{RESTAURANT_ADDRESS.replace(', ', '\n')}</p>
            <p>WhatsApp: +39 0825 172 8034 | Email: pane.caffebonito@gmail.com</p>
        </div>
        <div className="border-t border-brand-red/10 pt-4 mt-4">
            <p>&copy; {new Date().getFullYear()} Pane & Caffè. Tutti i diritti riservati.</p>
            <p className="text-sm mt-2">Sviluppato da VinCam</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;