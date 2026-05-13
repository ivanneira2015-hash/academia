import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './ProductCard'

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const InStock: Story = {
  args: {
    id: 'prod-001',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    stock: 10,
  },
}

export const OutOfStock: Story = {
  args: {
    id: 'prod-002',
    name: 'Mouse',
    description: 'Wireless mouse',
    price: 29.99,
    stock: 0,
  },
}
