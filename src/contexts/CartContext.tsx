import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: 'cash' | 'card' | 'online';
}

interface CartContextType {
  cartItems: CartItem[];
  currentOrder: Order | null;
  addToCart: (item: MenuItem, quantity: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  submitOrder: (customerInfo: CustomerInfo, paymentMethod: string) => Promise<string>;
  trackOrder: (orderId: string) => () => void; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const addToCart = (item: MenuItem, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const submitOrder = async (customerInfo: CustomerInfo, paymentMethod: string) => {
    try {
      const orderData = {
        customerInfo,
        items: cartItems.map(item => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        status: 'pending' as const,
        total: getTotalPrice(),
        createdAt: serverTimestamp(), 
        updatedAt: serverTimestamp(), 
        paymentMethod: paymentMethod as 'cash' | 'card' | 'online'
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      setCurrentOrder({
        id: docRef.id,
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  const trackOrder = (orderId: string) => {
    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCurrentOrder({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          status: data.status || 'pending'
        } as Order);
      }
    });

    return unsubscribe;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };



  return (
    <CartContext.Provider value={{
      cartItems,
      currentOrder,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalItems,
      submitOrder,
      trackOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};