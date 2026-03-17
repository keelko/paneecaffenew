import React, { useState, useMemo, useEffect } from 'react';
import { CartItem } from '../types';
import { DELIVERY_FEE, RESTAURANT_ADDRESS } from '../constants';
import { TIME_SLOTS_CSV_URL } from '../config/googleSheet';
import { ORDER_LOGGER_URL } from '../config/orderLogger';
import XMarkIcon from './icons/XMarkIcon';
import TrashIcon from './icons/TrashIcon';
import QuantitySelector from './QuantitySelector';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import PickupIcon from './icons/PickupIcon';
import DeliveryIcon from './icons/DeliveryIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import AddressInput from './AddressInput';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

type DaySlotsMap = Record<string, string>;
type TimeSlotsConfig = Record<string, DaySlotsMap>;
type TimeSlot = { time: string; status: string; };


// Lista di orari di fallback da usare se il Google Sheet non è raggiungibile.
const FALLBACK_TIME_SLOTS: TimeSlot[] = [
    { time: '19:00', status: 'available' },
    { time: '19:30', status: 'available' },
    { time: '20:00', status: 'available' },
    { time: '20:30', status: 'available' },
    { time: '21:00', status: 'available' },
    { time: '21:30', status: 'available' },
    { time: '22:00', status: 'available' },
    { time: '22:30', status: 'available' },
    { time: '23:00', status: 'available' },
];


const fetchAndParseTimeSlots = async (retries = 2): Promise<TimeSlotsConfig> => {
    if (!TIME_SLOTS_CSV_URL) {
        console.error("URL del Google Sheet non configurato in config/googleSheet.ts");
        return {};
    }

    const fetchWithTimeout = async (url: string, timeout = 5000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (e) {
            clearTimeout(id);
            throw e;
        }
    };

    for (let i = 0; i <= retries; i++) {
        try {
            // Prova prima il fetch diretto (Google Sheets di solito permette CORS per i CSV pubblicati)
            let response;
            try {
                const directUrl = `${TIME_SLOTS_CSV_URL}&_=${new Date().getTime()}`;
                response = await fetchWithTimeout(directUrl);
            } catch (e) {
                // Se fallisce il fetch diretto (es. CORS), prova tramite proxy
                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                const urlToFetch = `${TIME_SLOTS_CSV_URL}&_=${new Date().getTime()}`;
                response = await fetchWithTimeout(`${proxyUrl}${encodeURIComponent(urlToFetch)}`);
            }
            
            if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
            
            let csvText = await response.text();
            
            if (csvText.charCodeAt(0) === 0xFEFF) {
                csvText = csvText.substring(1);
            }
            
            const rows = csvText.split(/\r?\n/);
            if (rows.length < 2) return {};

            const headerRow = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
            const dayIndex = headerRow.indexOf('day');
            const timeIndex = headerRow.indexOf('time');
            const statusIndex = headerRow.indexOf('status');

            if (dayIndex === -1 || timeIndex === -1 || statusIndex === -1) {
                console.error("Intestazioni CSV non trovate. Assicurati che ci siano le colonne 'day', 'time', e 'status'.");
                return {};
            }

            const dataRows = rows.slice(1);
            
            const config: TimeSlotsConfig = {
                monday: {}, tuesday: {}, wednesday: {}, thursday: {}, 
                friday: {}, saturday: {}, sunday: {}
            };

            dataRows.forEach(row => {
                const trimmedRow = row.trim();
                if (!trimmedRow) return;

                const parts = trimmedRow.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                const day = (parts[dayIndex] || '').toLowerCase();
                const time = parts[timeIndex];
                
                const rawStatus = (parts[statusIndex] || '').toLowerCase();
                const status = rawStatus.includes('available') ? 'available' : 'unavailable';

                if (day && time && status && config[day]) {
                    config[day][time] = status;
                }
            });
            
            return config;
        } catch (error) {
            if (i === retries) {
                console.error("Errore nel recuperare o analizzare gli orari dopo vari tentativi:", error);
                return {};
            }
            // Aspetta un po' prima di riprovare
            await new Promise(res => setTimeout(res, 500 * (i + 1)));
        }
    }
    return {};
};


const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [step, setStep] = useState(1); // 1: Summary, 2: Details, 3: Success
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [city, setCity] = useState('Ariano Irpino');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('asap');
  const [isLocating, setIsLocating] = useState(false);
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] = useState(false);
  
  const [dayTimeSlots, setDayTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [usingFallbackTimes, setUsingFallbackTimes] = useState(false);


  useEffect(() => {
    if (isOpen && step !== 3) {
        const loadTimeSlots = async () => {
            setIsLoadingTimes(true);
            setUsingFallbackTimes(false);
            let slotsToProcess: TimeSlot[] = [];

            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000)
            );

            try {
                const config = await Promise.race([
                    fetchAndParseTimeSlots(),
                    timeoutPromise,
                ]);

                const today = new Date();
                const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
                const daySlots = config[dayOfWeek] || {};

                if (Object.keys(daySlots).length === 0) {
                    throw new Error("Nessun orario valido ricevuto dallo Sheet.");
                }

                const forbiddenTimes = ['23:30', '24:00'];
                slotsToProcess = Object.entries(daySlots)
                    .map(([time, status]) => ({ time, status }))
                    .filter(slot => !forbiddenTimes.includes(slot.time))
                    .sort((a, b) => a.time.localeCompare(b.time));

            } catch (error) {
                console.warn("Caricamento orari da Google Sheet fallito o in timeout. Utilizzo degli orari di fallback.", error);
                slotsToProcess = FALLBACK_TIME_SLOTS;
                setUsingFallbackTimes(true);
            } finally {
                const now = new Date();
                const preparationBufferMinutes = 15;
                const availabilityThreshold = new Date(now.getTime() + preparationBufferMinutes * 60 * 1000);

                const updatedSlots = slotsToProcess.map(slot => {
                    const [hours, minutes] = slot.time.split(':').map(Number);
                    const slotTime = new Date();
                    slotTime.setHours(hours, minutes, 0, 0);

                    if (slotTime < availabilityThreshold) {
                        return { ...slot, status: 'past' };
                    }
                    return slot;
                });

                setDayTimeSlots(updatedSlots);
                setIsLoadingTimes(false);
            }
        };
        loadTimeSlots();
    }
}, [isOpen, step]);

  const baseTotalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  }, [cartItems]);

  const finalTotalPrice = useMemo(() => {
    const totalWithDelivery = deliveryType === 'delivery' ? baseTotalPrice + DELIVERY_FEE : baseTotalPrice;
    return Math.max(0, totalWithDelivery);
  }, [baseTotalPrice, deliveryType]);


  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setMapsLink(link);
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&email=downloandroid@gmail.com`);
            const data = await res.json();
            if (data && data.address) {
                setCity(data.address.town || data.address.city || data.address.village || 'Ariano Irpino');
                setStreet(data.address.road || '');
                setHouseNumber(data.address.house_number || '');
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
          }

          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Impossibile recuperare la posizione. Assicurati di aver dato i permessi.");
          setIsLocating(false);
        }
      );
    } else {
      alert("La geolocalizzazione non è supportata da questo browser.");
    }
  };

  const logOrderToSheet = () => {
    if (!ORDER_LOGGER_URL) {
        console.warn("URL per il logging non configurato. Salto la registrazione su Google Sheet.");
        return;
    }

    try {
        const orderDetailsString = cartItems.map(item => {
            let detail = `${item.quantity}x ${item.product.name}`;
            if (item.variant === 'menu') detail += ` (Menù)`;

            const customizations: string[] = [];
            if (item.removedIngredients.length > 0) customizations.push(`Senza: ${item.removedIngredients.join(', ')}`);
            if (item.addedExtras.length > 0) customizations.push(`Extra: ${item.addedExtras.map(e => e.name).join(', ')}`);
            if (item.variant === 'menu' && item.selectedDrink) customizations.push(`Bibita: ${item.selectedDrink.name}`);
            if (item.selectedFrySauces && item.selectedFrySauces.length > 0) customizations.push(`Salse: ${item.selectedFrySauces.join(', ')}`);
            if (item.notes) customizations.push(`Nota: ${item.notes}`);

            if (customizations.length > 0) {
                detail += ` [${customizations.join('; ')}]`;
            }
            return detail;
        }).join(' / ');

        const fullAddress = `${street}, ${houseNumber}, ${city}${mapsLink ? `\nPosizione GPS: ${mapsLink}` : ''}`;
        
        const payload = {
            customerName: customerName.trim(),
            phoneNumber: phoneNumber.trim(),
            deliveryType: deliveryType === 'delivery' ? 'Consegna a Domicilio' : 'Ritiro in Sede',
            address: deliveryType === 'delivery' ? fullAddress : '',
            orderDetails: orderDetailsString,
            totalPrice: finalTotalPrice.toFixed(2).replace('.', ','),
        };
        
        fetch(ORDER_LOGGER_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            redirect: 'follow',
        }).catch(error => {
            console.warn("Invio a Google Sheet completato (eventuali errori di rete sono normali con 'no-cors'):", error);
        });
    } catch (error) {
        console.error("Errore durante la preparazione dei dati per Google Sheet:", error);
    }
  };


  const handleSendWhatsApp = () => {
    logOrderToSheet();
    
    const whatsappNumber = "3908251728034";
    let message = `🍔 *NUOVO ORDINE - PANE & CAFFÈ* ☕\n\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Telefono:* ${phoneNumber}\n`;
    message += `*Modalità:* ${deliveryType === 'delivery' ? 'Consegna a Domicilio' : 'Ritiro in Sede'}\n`;
    
    const asapEmoji = usingFallbackTimes ? '🏃‍♂️' : '⚡';
    const timeSlotText = timeSlot === 'asap' ? `${asapEmoji} Il prima possibile` : timeSlot;
    message += `*Orario Richiesto:* ${timeSlotText}\n`;
    
    message += `_(attendo conferma orario via WhatsApp)_\n\n`;
    
    message += "📝 *RIEPILOGO ORDINE:*\n";
    message += "-----------------------------------\n";

    cartItems.forEach(item => {
      message += `*${item.quantity}x* ${item.product.name}`;
      if (item.variant === 'menu') message += ` *(Menù)*`;
      message += ` - *€${(item.finalPrice * item.quantity).toFixed(2)}*\n`;
      
      if (item.removedIngredients.length > 0) {
          message += `   - Senza: ${item.removedIngredients.join(', ')}\n`;
      }
      if (item.addedExtras.length > 0) {
          const extrasString = item.addedExtras.map(e => `${e.name} (+€${e.price.toFixed(2)})`).join(', ');
          message += `   - Extra: ${extrasString}\n`;
      }
      
      if (item.variant === 'menu') {
          message += `   - Bibita: ${item.selectedDrink?.name || 'N/D'}\n`;
      }

      if (item.selectedFrySauces && item.selectedFrySauces.length > 0) {
        const sauceLabel = item.variant === 'menu' ? 'Salse Patatine' : 'Salse';
        message += `   - ${sauceLabel}: ${item.selectedFrySauces.join(', ')}\n`;
      }
      
      if (item.notes) message += `   - Nota: _${item.notes}_\n`;
    });

    message += "-----------------------------------\n";
    message += `Subtotale: €${baseTotalPrice.toFixed(2)}\n`;

    if (deliveryType === 'delivery') {
        message += `Costo Consegna: €${DELIVERY_FEE.toFixed(2)}\n`;
    }
    message += `*TOTALE:* *€${finalTotalPrice.toFixed(2)}*\n\n`;
    
    if (deliveryType === 'delivery') {
        const fullAddress = `${street}, ${houseNumber}, ${city}${mapsLink ? `\n📍 Posizione GPS: ${mapsLink}` : ''}`;
        message += `📍 *INDIRIZZO DI CONSEGNA:*\n${fullAddress}\n\n`;
    } else {
        message += `🏠 *INDIRIZZO DI RITIRO:*\n${RESTAURANT_ADDRESS}\n\n`;
    }

    message += "Grazie!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    try {
      const today = new Date().toISOString().split('T')[0];
      const key = 'paneECaffeOrderCounter';
      const storedData = localStorage.getItem(key);
      let newCount = 1;

      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.date === today) {
          newCount = data.count + 1;
        }
      }
      
      localStorage.setItem(key, JSON.stringify({ date: today, count: newCount }));
      
      window.dispatchEvent(new CustomEvent('order-placed'));
    } catch (error) {
      console.error("Could not update order count in localStorage", error);
    }

    onClearCart();
    setStep(3);
    setShowWhatsAppConfirmation(false);

    setTimeout(() => {
        if(isOpen) onClose();
    }, 4000);
  };

  const handleProceedToConfirmation = () => {
    const isNameValid = customerName.trim() !== '';
    const isPhoneValid = phoneNumber.trim() !== '';
    const isAddressValid = deliveryType === 'pickup' || (street.trim() !== '' && houseNumber.trim() !== '' && city.trim() !== '');

    setNameError(!isNameValid);
    setPhoneError(!isPhoneValid);
    setAddressError(!isAddressValid);

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
        // Scroll to the first error
        const scrollContainer = document.querySelector('.overflow-y-auto');
        if (scrollContainer) {
            if (!isNameValid || !isPhoneValid) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (!isAddressValid) {
                scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
            }
        }
        return;
    }
    setShowWhatsAppConfirmation(true);
  };
  
  const handleFullClearCart = () => {
    onClearCart();
  };

  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => {
            setDeliveryType('pickup');
            setTimeSlot('asap');
            setStep(1);
            setNameError(false);
            setPhoneError(false);
            setAddressError(false);
            setPhoneNumber('');
            setShowWhatsAppConfirmation(false);
        }, 300);
    }
  }, [isOpen]);
  
  useEffect(() => {
      if(cartItems.length === 0 && isOpen && step !== 3) {
          setStep(1);
      }
  }, [cartItems, isOpen, step])

  if (!isOpen) return null;

  const renderSummaryStep = () => (
    <>
      <div className="p-4 flex-grow overflow-y-auto scrollbar-hide">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Il carrello è vuoto.</p>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <button onClick={handleFullClearCart} className="text-sm text-red-500 hover:text-red-400">Svuota carrello</button>
              </div>
              <ul className="divide-y border-brand-red/10">
                {cartItems.map(item => (
                    <li key={item.id} className="py-4 flex items-start space-x-4">
                      <img src={item.product.image} alt={item.product.name} className={`w-16 h-16 ${item.product.imageFit === 'cover' ? 'object-cover' : 'object-contain'} rounded-md bg-brand-red/5 p-1`} />
                      <div className="flex-grow">
                        <p className="font-bold text-brand-dark">{item.product.name} {item.variant === 'menu' ? '(Menù)' : ''}</p>
                        <div className="text-xs text-gray-600 space-y-1 mt-1">
                            {item.variant === 'menu' && <p>Bibita: {item.selectedDrink?.name}</p>}
                            {item.removedIngredients.length > 0 && <p>Senza: {item.removedIngredients.join(', ')}</p>}
                            {item.addedExtras.length > 0 && <p>Extra: {item.addedExtras.map(e => e.name).join(', ')}</p>}
                            {item.selectedFrySauces && item.selectedFrySauces.length > 0 && <p>Salse: {item.selectedFrySauces.join(', ')}</p>}
                            {item.notes && <p>Nota: <em>{item.notes}</em></p>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <QuantitySelector 
                          quantity={item.quantity} 
                          onQuantityChange={(newQuantity) => onUpdateQuantity(item.id, newQuantity)} 
                        />
                        <span className="text-lg font-semibold text-brand-red">€{(item.finalPrice * item.quantity).toFixed(2)}</span>
                        <button onClick={() => onRemoveItem(item.id)} className="text-gray-500 hover:text-red-500" aria-label="Rimuovi articolo"><TrashIcon className="h-4 w-4"/></button>
                      </div>
                    </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {cartItems.length > 0 && (
            <div className="p-4 border-t border-brand-red/10 bg-brand-red/5">
                 <div className="space-y-2 text-lg">
                    <div className="flex justify-between items-center font-bold text-xl text-brand-dark">
                        <span>Totale</span>
                        <span>€{baseTotalPrice.toFixed(2)}</span>
                    </div>
                 </div>
                 <button
                    onClick={() => setStep(2)}
                    className="mt-4 w-full bg-brand-red text-white font-bold py-3 px-4 rounded-md hover:bg-brand-red/90 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <span>Prosegui (€{baseTotalPrice.toFixed(2)})</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>
        )}
    </>
  );

  const renderDetailsStep = () => (
    <>
        <div className="p-4 flex-grow overflow-y-auto scrollbar-hide space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Modalità di Ritiro</label>
                <div className="grid grid-cols-2 gap-2 rounded-md p-1 bg-brand-red/5">
                    <button onClick={() => setDeliveryType('pickup')} className={`w-full py-2 text-sm rounded transition-all flex items-center justify-center gap-2 ${deliveryType === 'pickup' ? 'bg-brand-red text-white font-bold shadow-md' : 'text-brand-dark hover:bg-brand-red/5'}`}>
                      <PickupIcon className="h-5 w-5"/> Ritiro in Sede
                    </button>
                    <button onClick={() => setDeliveryType('delivery')} className={`w-full py-2 text-sm rounded transition-all flex items-center justify-center gap-2 ${deliveryType === 'delivery' ? 'bg-brand-red text-white font-bold shadow-md' : 'text-brand-dark hover:bg-brand-red/5'}`}>
                      <DeliveryIcon className="h-5 w-5"/> Consegna (+€{DELIVERY_FEE.toFixed(2)})
                    </button>
                </div>
              </div>
              {deliveryType === 'pickup' && (
                  <div className="text-center bg-brand-red/5 p-3 rounded-md">
                      <p className="text-sm font-semibold text-brand-dark">Indirizzo per il ritiro:</p>
                      <p className="text-xs text-gray-600">{RESTAURANT_ADDRESS}</p>
                  </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-600 mb-1">Nome e Cognome</label>
                      <input 
                        id="customerName" 
                        type="text" 
                        value={customerName} 
                        onChange={e => {
                            setCustomerName(e.target.value);
                            if (nameError) setNameError(false);
                        }} 
                        className={`w-full bg-white text-brand-dark border rounded-md p-2 outline-none transition-all ${nameError ? 'border-red-500 ring-2 ring-red-500/50' : 'border-brand-red/10 focus:ring-2 focus:ring-brand-red'}`}
                        placeholder="Mario Rossi" />
                      {nameError && <p className="text-red-600 text-sm mt-1">Per favore, inserisci nome e cognome.</p>}
                  </div>
                  <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 mb-1">Numero di Telefono</label>
                      <input 
                        id="phoneNumber" 
                        type="tel" 
                        value={phoneNumber} 
                        onChange={e => {
                            setPhoneNumber(e.target.value);
                            if (phoneError) setPhoneError(false);
                        }} 
                        className={`w-full bg-white text-brand-dark border rounded-md p-2 outline-none transition-all ${phoneError ? 'border-red-500 ring-2 ring-red-500/50' : 'border-brand-red/10 focus:ring-2 focus:ring-brand-red'}`}
                        placeholder="3331234567" />
                      {phoneError && <p className="text-red-600 text-sm mt-1">Per favore, inserisci un numero.</p>}
                  </div>
                  <div className="sm:col-span-2">
                      <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-600 mb-1">Orario</label>
                      <select id="timeSlot" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} disabled={isLoadingTimes} className="w-full bg-white text-brand-dark border border-brand-red/10 rounded-md p-2 focus:ring-2 focus:ring-brand-red outline-none disabled:opacity-50">
                          <option value="asap">{usingFallbackTimes ? '🏃‍♂️' : '⚡'} Il prima possibile</option>
                          {isLoadingTimes ? (
                              <option disabled>Caricamento orari...</option>
                          ) : (
                              dayTimeSlots.map(slot => {
                                  const isUnavailable = slot.status !== 'available';
                                  let label = slot.time;
                                  if (slot.status === 'past') {
                                    label += ' (Passato)';
                                  } else if (isUnavailable) {
                                    label += ' (Non disp.)';
                                  }
                                  return (
                                    <option 
                                        key={slot.time} 
                                        value={slot.time} 
                                        disabled={isUnavailable}
                                        className={isUnavailable ? 'text-gray-400' : ''}
                                    >
                                        {label}
                                    </option>
                                  );
                                })
                          )}
                          {!isLoadingTimes && dayTimeSlots.length === 0 && (
                              <option disabled>Nessun orario prenotabile per oggi.</option>
                          )}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Gli ordini chiudono alle 23:00.</p>
                  </div>
              </div>

              {deliveryType === 'delivery' && (
                <div className="pt-2 border-t border-brand-red/10">
                  <h3 className="text-lg font-bold text-brand-dark mb-3">Indirizzo di Consegna</h3>
                  <AddressInput 
                    city={city}
                    setCity={(val) => { setCity(val); if(addressError) setAddressError(false); }}
                    street={street}
                    setStreet={(val) => { setStreet(val); if(addressError) setAddressError(false); }}
                    houseNumber={houseNumber}
                    setHouseNumber={(val) => { setHouseNumber(val); if(addressError) setAddressError(false); }}
                    onGetLocation={handleGetLocation}
                    isLocating={isLocating}
                    showError={addressError}
                  />
                </div>
              )}
        </div>
        <div className="p-4 border-t border-brand-red/10 bg-brand-red/5">
             <div className="space-y-1 mb-4 text-lg">
                <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotale</span>
                    <span>€{baseTotalPrice.toFixed(2)}</span>
                </div>
                {deliveryType === 'delivery' && (
                <div className="flex justify-between items-center text-gray-600">
                    <span>Consegna</span>
                    <span>€{DELIVERY_FEE.toFixed(2)}</span>
                </div>
                )}
                <div className="flex justify-between items-center font-bold text-xl border-t border-brand-red/20 pt-2 mt-2 text-brand-dark">
                    <span>Totale</span>
                    <span>€{finalTotalPrice.toFixed(2)}</span>
                </div>
            </div>
            <div className="space-y-2">
                <button
                onClick={handleProceedToConfirmation}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="h-6 w-6" />
                  <span>Invia Ordine su WhatsApp</span>
                </button>
                <button onClick={() => setStep(1)} className="w-full text-center text-gray-600 text-sm py-2 hover:text-brand-dark">
                    Torna al Riepilogo
                </button>
            </div>
          </div>
    </>
  );

  const renderSuccessStep = () => (
    <div className="p-8 flex flex-col items-center justify-center text-center flex-grow animate-fade-in">
        <CheckCircleIcon className="h-20 w-20 text-green-500" />
        <h3 className="text-2xl font-bold text-green-600 mt-4">Ordine Inviato con Successo!</h3>
        <p className="text-gray-600 mt-2 max-w-sm">
            Il tuo ordine è stato inviato a Pane & Caffè. Riceverai una conferma e l'orario definitivo direttamente su WhatsApp.
        </p>
        <p className="text-gray-500 mt-4 text-sm">
            Questa finestra si chiuderà tra poco...
        </p>
    </div>
  );

  const renderWhatsAppConfirmation = () => (
    <div className="fixed inset-0 bg-black/80 z-[51] flex justify-center items-center p-4" onClick={() => setShowWhatsAppConfirmation(false)}>
      <div 
        className="bg-brand-cream border border-brand-red/10 rounded-lg shadow-2xl w-full max-w-md p-6 text-center flex flex-col items-center space-y-4 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <WhatsAppIcon className="h-16 w-16 text-green-500" />
        <h3 className="text-3xl font-bebas tracking-wide text-brand-dark">Quasi Fatto!</h3>
        <p className="text-gray-600">
          Stai per essere reindirizzato su WhatsApp. Per confermare l'ordine,{' '}
          <strong className="text-brand-dark">devi solo premere "Invia"</strong> nel messaggio che abbiamo preparato per te.
        </p>
        <p className="text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded-md">
          ⚠️ Senza l'invio del messaggio, il tuo ordine non sarà ricevuto!
        </p>
        <div className="w-full pt-4 space-y-2">
          <button 
            onClick={handleSendWhatsApp} 
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
          >
            Vai a WhatsApp e Invia
          </button>
          <button 
            onClick={() => setShowWhatsAppConfirmation(false)} 
            className="w-full text-center text-gray-600 text-sm py-2 hover:text-brand-dark"
          >
            Torna al carrello
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-brand-red/10">
          <h2 className="text-3xl font-bebas tracking-wide text-brand-dark">
            {step === 1 && 'Riepilogo Ordine'}
            {step === 2 && 'Dettagli e Conferma'}
            {step === 3 && 'Fatto!'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-red/5" aria-label="Chiudi carrello"><XMarkIcon className="h-6 w-6 text-brand-dark" /></button>
        </div>
        
        {step === 1 && renderSummaryStep()}
        {step === 2 && renderDetailsStep()}
        {step === 3 && renderSuccessStep()}

      </div>
      {showWhatsAppConfirmation && renderWhatsAppConfirmation()}
    </div>
  );
};

export default CartModal;