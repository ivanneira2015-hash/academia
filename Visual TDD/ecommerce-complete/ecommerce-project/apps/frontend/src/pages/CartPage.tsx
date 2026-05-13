import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { Button } from '../components/Button'
import { ordersApi } from '../services/api'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, total, fetchCart, removeItem } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [])

  const handleCheckout = async () => {
    try {
      await ordersApi.create()
      alert('Order created successfully!')
      navigate('/orders')
    } catch (error) {
      console.error('Failed to create order', error)
      alert('Failed to create order')
    }
  }

  if (items.length === 0) {
    return <div className="p-8"><p>Your cart is empty</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Cart</h1>
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between items-center border p-4 rounded">
            <div>
              <p className="font-bold">Product {item.productId}</p>
              <p className="text-sm">{item.quantity}x ${item.price}</p>
            </div>
            <Button onClick={() => removeItem(item.productId)} variant="secondary">
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="text-xl font-bold mb-8">Total: ${total}</div>
      <Button onClick={handleCheckout} variant="primary">
        Checkout
      </Button>
    </div>
  )
}
