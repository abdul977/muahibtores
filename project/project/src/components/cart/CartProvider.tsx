'use client'
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product } from '@/payload-types'

type CartItem = {
  product: Product
  quantity: number
  variants?: {
    name: string
    value: string
  }[]
}

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      }

      const updatedItems = [...state.items, action.payload]
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.product.id !== action.payload.productId)
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item,
      )
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
      }

    default:
      return state
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.product.price || 0
    return total + itemPrice * item.quantity
  }, 0)
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}