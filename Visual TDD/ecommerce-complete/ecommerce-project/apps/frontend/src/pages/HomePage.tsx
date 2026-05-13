import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { ProductCard } from '../components/ProductCard'
import { productsApi } from '../services/api'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll()
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to load products', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await addItem(productId, quantity)
      alert('Added to cart!')
    } catch (error) {
      console.error('Failed to add to cart', error)
      alert('Failed to add to cart')
    }
  }

  if (loading) return <div className="p-8">Loading products...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={(quantity) => handleAddToCart(product.id, quantity)}
          />
        ))}
      </div>
    </div>
  )
}
