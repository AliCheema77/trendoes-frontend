'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProductType } from '@/type/ProductType';

interface CartItem extends ProductType {
    quantity: number
    selectedSize: string
    selectedColor: string
    sizeId?: number
    colorId?: number
}

interface CartState {
    cartArray: CartItem[]
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: ProductType }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_CART'; payload: { itemId: string; quantity: number; selectedSize: string; selectedColor: string; sizeId?: number; colorId?: number } }
    | { type: 'LOAD_CART'; payload: CartItem[] }
    | { type: 'CLEAR_CART' }

interface CartContextProps {
    cartState: CartState;
    addToCart: (item: ProductType) => void;
    removeFromCart: (itemId: string) => void;
    updateCart: (itemId: string, quantity: number, selectedSize: string, selectedColor: string, sizeId?: number, colorId?: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const newItem: CartItem = { ...action.payload, quantity: 1, selectedSize: '', selectedColor: '' };
            return { ...state, cartArray: [...state.cartArray, newItem] };
        case 'REMOVE_FROM_CART':
            return { ...state, cartArray: state.cartArray.filter(item => item.id !== action.payload) };
        case 'UPDATE_CART':
            return {
                ...state,
                cartArray: state.cartArray.map(item =>
                    item.id === action.payload.itemId
                        ? {
                            ...item,
                            quantity: action.payload.quantity,
                            selectedSize: action.payload.selectedSize,
                            selectedColor: action.payload.selectedColor,
                            sizeId: action.payload.sizeId,
                            colorId: action.payload.colorId,
                        }
                        : item
                ),
            };
        case 'LOAD_CART':
            return { ...state, cartArray: action.payload };
        case 'CLEAR_CART':
            return { ...state, cartArray: [] };
        default:
            return state;
    }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, { cartArray: [] });

    useEffect(() => {
        try {
            const saved = localStorage.getItem('cart')
            if (saved) dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
        } catch { /* ignore parse errors */ }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartState.cartArray))
    }, [cartState.cartArray])

    const addToCart = (item: ProductType) => dispatch({ type: 'ADD_TO_CART', payload: item });
    const removeFromCart = (itemId: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    const updateCart = (itemId: string, quantity: number, selectedSize: string, selectedColor: string, sizeId?: number, colorId?: number) => {
        dispatch({ type: 'UPDATE_CART', payload: { itemId, quantity, selectedSize, selectedColor, sizeId, colorId } });
    };
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    return (
        <CartContext.Provider value={{ cartState, addToCart, removeFromCart, updateCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};