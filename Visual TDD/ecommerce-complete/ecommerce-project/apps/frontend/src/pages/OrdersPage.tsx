import React, { useEffect, useState } from 'react'
import { ordersApi } from '../services/api'

interface Order {
  id: string
  userId: string
  total: number
  status: string
  itemCount: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await ordersApi.listMine()
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to load orders', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading orders...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow">
              <p className="font-bold">Order {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Items: {order.itemCount}</p>
              <p className="text-lg font-bold">Total: ${order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
