import React from 'react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/payload-types'

export const ProductGrid: React.FC<{
  products: Product[]
}> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}