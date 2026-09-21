import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'smart-canteen-cart';

const readCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCartFromStorage);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.menuItem === item.menuItem);

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.menuItem === item.menuItem
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId, quantity) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.menuItem !== menuItemId);
      }

      return currentItems.map((item) =>
        item.menuItem === menuItemId ? { ...item, quantity } : item
      );
    });
  };

  const removeItem = (menuItemId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.menuItem !== menuItemId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
