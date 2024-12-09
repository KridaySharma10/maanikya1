import Link from 'next/link'
import Image from 'next/image'

interface Bid {
  amount: number
  userId: string
  username: string
  timestamp: Date
}

interface Product {
  id: string
  brand: string
  model: string
  reference: string
  imageUrl: string
  startingPrice: number
  currentBid?: number
  bids?: Bid[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-blue-300">{product.brand}</h3>
              <p className="text-blue-100">{product.model}</p>
              <p className="text-sm text-blue-200">Ref: {product.reference}</p>
              <div className="mt-4">
                <p className="text-sm text-blue-200">Starting at:</p>
                <p className="text-lg font-semibold text-blue-300">${product.startingPrice.toLocaleString()}</p>
              </div>
              {product.currentBid && (
                <div className="mt-2">
                  <p className="text-sm text-blue-200">Current bid:</p>
                  <p className="text-lg font-semibold text-green-400">${product.currentBid.toLocaleString()}</p>
                </div>
              )}
              {product.bids && (
                <div className="mt-2">
                  <p className="text-sm text-blue-200">Total bids: {product.bids.length}</p>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

