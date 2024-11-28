'use client'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from './CartProvider'
import Link from 'next/link'

export const CartButton: React.FC = () => {
  const { state } = useCart()
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {itemCount}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  )
}