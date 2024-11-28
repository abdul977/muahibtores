import React from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductSort } from '@/components/products/ProductSort'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { sort, category, minPrice, maxPrice } = searchParams
  
  const payload = await getPayload({ config: configPromise })
  
  const query: any = {
    where: {},
    sort: sort === 'price-desc' ? '-price' : sort === 'price-asc' ? 'price' : '-createdAt',
  }

  if (category) {
    query.where.category = { equals: category }
  }

  if (minPrice || maxPrice) {
    query.where.price = {}
    if (minPrice) query.where.price.greater_than = Number(minPrice)
    if (maxPrice) query.where.price.less_than = Number(maxPrice)
  }

  const products = await payload.find({
    collection: 'products',
    ...query,
  })

  const categories = await payload.find({
    collection: 'categories',
  })

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <ProductFilters categories={categories.docs} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-muted-foreground">
              {products.totalDocs} products found
            </p>
            <ProductSort />
          </div>
          <ProductGrid products={products.docs} />
        </div>
      </div>
    </div>
  )
}