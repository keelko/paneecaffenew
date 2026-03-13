import React, { useState, useEffect } from 'react';
import ReceiptIcon from './icons/ReceiptIcon';

const OrderCounter: React.FC = () => {
  const [orderCount, setOrderCount] = useState(0);

  const fetchOrderCount = () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = 'paneECaffeOrderCounter';
      const storedData = localStorage.getItem(key);

      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.date === today) {
          setOrderCount(data.count);
        } else {
          // It's a new day, count should be 0
          setOrderCount(0);
        }
      } else {
        setOrderCount(0);
      }
    } catch (error) {
      console.error("Could not fetch order count from localStorage", error);
      setOrderCount(0);
    }
  };

  useEffect(() => {
    fetchOrderCount();

    const handleOrderPlaced = () => {
      fetchOrderCount();
    };
    
    // Listen for the custom event dispatched from CartModal
    window.addEventListener('order-placed', handleOrderPlaced);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('order-placed', handleOrderPlaced);
    };
  }, []);
  
  return (
    <div className="flex items-center gap-2 bg-gray-700/50 text-white px-3 py-1.5 rounded-full">
        <ReceiptIcon className="h-5 w-5 text-amber-300" />
        <div className="text-sm">
            <span className="font-semibold text-amber-300">{orderCount}</span>
            <span className="text-gray-300"> Ordini di Oggi</span>
        </div>
    </div>
  );
};

export default OrderCounter;