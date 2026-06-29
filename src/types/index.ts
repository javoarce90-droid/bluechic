// Categoría, colección y talle ahora son dinámicos (administrables desde el panel)
export type ProductCategory = string
export type ProductCollection = string
export type ProductSize = string
export type PaymentMethod = 'mp' | 'transfer'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Category {
  id: string
  name: string
  slug: string
  sort: number
  created_at: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  sort: number
  created_at: string
}

export interface Color {
  id: string
  name: string
  hex: string | null
  created_at: string
}

export interface StoreSettings {
  transfer_cbu: string
  transfer_alias: string
  transfer_holder: string
  transfer_bank: string
  mp_alias: string
}

export interface ProductVariant {
  id: string
  product_id: string
  size: ProductSize
  color: string
  stock: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  collection: ProductCollection
  price: number
  description: string
  images: string[]
  featured: boolean
  active: boolean
  created_at: string
  variants?: ProductVariant[]
}

export interface CartItem {
  productId: string
  variantId: string
  productName: string
  price: number
  image: string
  size: ProductSize
  color: string
  quantity: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  size: string
  color: string
  quantity: number
  unit_price: number
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  status: OrderStatus
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_province: string
  shipping_postal: string
  shipping_apt?: string
  payment_method: PaymentMethod
  subtotal: number
  shipping_cost: number
  total: number
  notes?: string
  created_at: string
  items?: OrderItem[]
}

export interface CreateOrderInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postal: string
  apt?: string
  paymentMethod: PaymentMethod
  items: CartItem[]
}
