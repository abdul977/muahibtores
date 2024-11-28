'use client'
import { useCart } from '@/components/cart/CartProvider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatPrice } from '@/utilities/formatPrice'

export default function CartPage() {
  const { state, dispatch } = useCart()

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-8">Add some products to your cart to continue shopping.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-24">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {state.items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border-b border-border py-4 last:border-0"
            >
              <div className="w-24 h-24 relative rounded overflow-hidden">
                {item.product.images?.[0] && typeof item.product.images[0] === 'object' && (
                  <Media
                    resource={item.product.images[0].image}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {formatPrice(item.product.price || 0)}
                </p>
                {item.variants?.map((variant) => (
                  <p key={variant.name} className="text-sm">
                    {variant.name}: {variant.value}
                  </p>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  dispatch({ type: 'REMOVE_ITEM', payload: { productId: item.product.id } })
                }
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(state.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between font-bold mb-4">
                <span>Total</span>
                <span>{formatPrice(state.total)}</span>
              </div>
              <Button className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}