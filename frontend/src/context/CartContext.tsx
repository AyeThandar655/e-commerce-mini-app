'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CartContextType, CartState } from '@/types/cart';
import type { Product } from '@/types/product';
import { cartService } from '@/services/cartService';
import { getErrorMessage } from '@/lib/utils';

export const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Helper to recalculate totals locally
const recalculate = (items: CartState['items']): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CartState>(initialState);

  // Fetch cart from server (initial load / after login)
  const fetchCart = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const cart = await cartService.getCart();
      setState({
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, []);

  // Add item — API call (needs server validation for stock)
  const addItem = useCallback(async (product: Product, quantity: number): Promise<void> => {
    try {
      const cart = await cartService.addItem(product.id, quantity);
      setState({
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  // Remove item — LOCAL only, no API call
  const removeItem = useCallback((cartItemId: number): void => {
    setState(prev => {
      const newItems = prev.items.filter(item => item.id !== cartItemId);
      const { totalItems, totalPrice } = recalculate(newItems);
      return { ...prev, items: newItems, totalItems, totalPrice, error: null };
    });
  }, []);

  // Update quantity — LOCAL only, no API call
  const updateQuantity = useCallback(
    (cartItemId: number, quantity: number): void => {
      if (quantity <= 0) {
        removeItem(cartItemId);
        return;
      }

      setState(prev => {
        const newItems = prev.items.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        const { totalItems, totalPrice } = recalculate(newItems);
        return { ...prev, items: newItems, totalItems, totalPrice, error: null };
      });
    },
    [removeItem]
  );

  // Sync cart with server — called on Checkout
  const syncCart = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Get server cart to compare
      const serverCart = await cartService.getCart();
      const serverItemMap = new Map(serverCart.items.map(item => [item.id, item]));

      // Find items to update, add, or remove
      const localItemMap = new Map(state.items.map(item => [item.id, item]));

      // Remove items that exist on server but not locally
      for (const serverItem of serverCart.items) {
        if (!localItemMap.has(serverItem.id)) {
          await cartService.removeItem(serverItem.id);
        }
      }

      // Update items that have different quantities
      for (const localItem of state.items) {
        const serverItem = serverItemMap.get(localItem.id);
        if (serverItem && serverItem.quantity !== localItem.quantity) {
          await cartService.updateItem(localItem.id, localItem.quantity);
        }
      }

      // Refetch to get final state
      const finalCart = await cartService.getCart();
      setState({
        items: finalCart.items,
        totalItems: finalCart.totalItems,
        totalPrice: finalCart.totalPrice,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, [state.items]);

  // Clear cart — remove all items from server then reset local state
  const clearCart = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const cart = await cartService.getCart();
      for (const item of cart.items) {
        await cartService.removeItem(item.id);
      }
      setState(initialState);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, []);

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    fetchCart,
    syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
