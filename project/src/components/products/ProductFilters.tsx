'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Category } from '@/payload-types'

export const ProductFilters: React.FC<{
  categories: Category[]
}> = ({ categories }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = React.useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get('maxPrice') || '')

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams)
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams)
    if (params.get('category') === categoryId) {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`block w-full text-left px-2 py-1 rounded hover:bg-accent ${
                searchParams.get('category') === category.id ? 'bg-accent' : ''
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button onClick={handleFilter} className="w-full">
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  )
}