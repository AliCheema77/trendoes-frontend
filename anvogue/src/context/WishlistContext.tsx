'use client'

// WishlistContext.tsx
import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { ProductType } from '@/type/ProductType';

interface WishlistItem extends ProductType {
}

interface WishlistState {
    wishlistArray: WishlistItem[]
}

type WishlistAction =
    | { type: 'ADD_TO_WISHLIST'; payload: ProductType }
    | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
    | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }

interface WishlistContextProps {
    wishlistState: WishlistState;
    addToWishlist: (item: ProductType) => void;
    removeFromWishlist: (itemId: string) => void;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

const WishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            const newItem: WishlistItem = { ...action.payload };
            return {
                ...state,
                wishlistArray: [...state.wishlistArray, newItem],
            };
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                wishlistArray: state.wishlistArray.filter((item) => item.id !== action.payload),
            };
        case 'LOAD_WISHLIST':
            return {
                ...state,
                wishlistArray: action.payload,
            };
        default:
            return state;
    }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistState, dispatch] = useReducer(WishlistReducer, { wishlistArray: [] });

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('wishlist')
            if (saved) dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(saved) })
        } catch {}
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistState.wishlistArray))
    }, [wishlistState.wishlistArray]);

    const addToWishlist = (item: ProductType) => {
        dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
    };

    const removeFromWishlist = (itemId: string) => {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
    };

    return (
        <WishlistContext.Provider value={{ wishlistState, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
