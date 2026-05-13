import React from 'react'
import { Button } from './Button'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  stock: number
  onAddToCart?: (quantity: number) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  stock,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity)
      setQuantity(1)
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-xl font-bold text-blue-600 mt-2">${price}</p>
      <p className="text-sm text-gray-500">Stock: {stock}</p>
      {stock > 0 && (
        <div className="mt-4 space-y-2">
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full border px-2 py-1 rounded"
          />
          <Button onClick={handleAddToCart} variant="primary">
            Add to Cart
          </Button>
        </div>
      )}
      {stock === 0 && <p className="text-red-500 mt-2">Out of Stock</p>}
    </div>
  )
}
