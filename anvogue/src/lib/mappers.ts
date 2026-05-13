import { ProductType } from '@/type/ProductType'

interface ApiColor {
  id: number
  name: string
  HEX: string
}

interface ApiStockColor {
  color: ApiColor
  quantity: number
}

interface ApiStockEntry {
  size: { id: number; name: string }
  colors: ApiStockColor[]
}

interface ApiImage {
  id: number
  url: string
  alt: string
}

interface ApiProduct {
  id: number
  name: string
  category: { id: number; name: string }
  subcategory: { id: number; name: string }
  gender: { id: number; name: string } | null
  brand: { id: number; name: string } | null
  tags: { id: number; name: string }[]
  description: string | null
  pricing: {
    actual_price: number
    discountPercent: number
    finalPrice: number
    currency: string
  }
  images: ApiImage[]
  stocks: ApiStockEntry[]
  meta: { createdAt: string | null; updatedAt: string | null; isActive: boolean }
  ratingValue: number
  totalReviews: number
  total_sold: number
}

export function mapApiProduct(p: ApiProduct): ProductType {
  const FALLBACK = '/images/product/1000x1000.png'
  const images = p.images.length > 0
    ? p.images.map(img => img.url)
    : [FALLBACK]
  const thumbImage = images.length >= 2 ? images.slice(0, 2) : [images[0], images[0]]

  // Unique sizes
  const sizes = Array.from(new Set(p.stocks.map(s => s.size.name)))

  // Unique colors across all stocks
  const colorMap = new Map<number, ApiColor>()
  for (const stock of p.stocks) {
    for (const c of stock.colors) {
      if (!colorMap.has(c.color.id)) colorMap.set(c.color.id, c.color)
    }
  }
  const variation = Array.from(colorMap.values()).map(color => ({
    color: color.name,
    colorCode: color.HEX || '#000000',
    colorImage: images[0] || '/images/product/1000x1000.png',
    image: images[0] || '/images/product/1000x1000.png',
  }))

  const quantity = p.stocks.reduce(
    (total, s) => total + s.colors.reduce((sum, c) => sum + c.quantity, 0),
    0
  )

  const isNew = p.tags.some(t => t.name.toLowerCase() === 'new') ||
    (!!p.meta.createdAt && Date.now() - new Date(p.meta.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000)

  return {
    id: p.id.toString(),
    category: p.category.name,
    type: p.subcategory.name,
    name: p.name,
    gender: p.gender?.name || '',
    new: isNew,
    sale: p.pricing.discountPercent > 0,
    rate: p.ratingValue,
    price: p.pricing.finalPrice,
    originPrice: p.pricing.actual_price,
    brand: p.brand?.name || '',
    sold: p.total_sold,
    quantity,
    quantityPurchase: 1,
    sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
    variation: variation.length > 0 ? variation : [{ color: 'Black', colorCode: '#000000', colorImage: thumbImage[0], image: thumbImage[0] }],
    thumbImage,
    images,
    description: p.description || '',
    action: 'add to cart',
    slug: p.id.toString(),
    stocksRaw: p.stocks,
  }
}

export function mapApiProducts(products: ApiProduct[]): ProductType[] {
  return products.map(mapApiProduct)
}