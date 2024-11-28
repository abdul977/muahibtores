import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatPrice } from '@/utilities/formatPrice'
import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'

export const ProductCard: React.FC<{
  product: Product
}> = ({ product }) => {
  const { title, price, compareAtPrice, images, slug } = product

  const image = images?.[0]?.image

  return (
    <div className="group">
      <Link href={`/products/${slug}`} className="block aspect-square overflow-hidden rounded-lg">
        {typeof image !== 'string' && (
          <Media
            resource={image}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </Link>
      <div className="mt-4">
        <Link href={`/products/${slug}`}>
          <h3 className="text-lg font-medium">{title}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-xl font-bold">{formatPrice(price)}</p>
          {compareAtPrice && compareAtPrice > price && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </p>
          )}
        </div>
        <Button className="w-full mt-4" variant="outline">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}