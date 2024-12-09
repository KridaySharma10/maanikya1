'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Bid {
  amount: number
  userId: string
  username: string
  timestamp: any
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

const featuredWatches: Product[] = [
  {
    id: 'rolex-daytona',
    brand: 'Rolex',
    model: 'Daytona',
    reference: '116500LN',
    imageUrl: '/placeholder.svg?height=300&width=300',
    startingPrice: 32500,
    currentBid: 33000,
    bids: [
      { amount: 32700, userId: 'user1', username: 'WatchEnthusiast', timestamp: new Date('2023-12-08T10:30:00') },
      { amount: 32900, userId: 'user2', username: 'LuxuryCollector', timestamp: new Date('2023-12-08T11:45:00') },
      { amount: 33000, userId: 'user3', username: 'TimePiece_Pro', timestamp: new Date('2023-12-08T14:20:00') },
    ]
  },
  {
    id: 'patek-philippe-nautilus',
    brand: 'Patek Philippe',
    model: 'Nautilus',
    reference: '5711/1A-010',
    imageUrl: '/placeholder.svg?height=300&width=300',
    startingPrice: 180000,
    currentBid: 185000,
    bids: [
      { amount: 181000, userId: 'user4', username: 'VintageTimeKeeper', timestamp: new Date('2023-12-07T09:15:00') },
      { amount: 183000, userId: 'user5', username: 'HorologicalMaster', timestamp: new Date('2023-12-07T16:30:00') },
      { amount: 185000, userId: 'user6', username: 'WristWatchWizard', timestamp: new Date('2023-12-08T11:00:00') },
    ]
  },
]

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      // First, check if it's a hardcoded product
      const hardcodedProduct = featuredWatches.find(watch => watch.id === id)
      if (hardcodedProduct) {
        setProduct(hardcodedProduct)
        return
      }

      // If not hardcoded, fetch from Firestore
      try {
        const productDoc = await getDoc(doc(db, 'products', id as string))
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() } as Product)
        } else {
          setError('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Error fetching product')
      }
    }

    fetchProduct()
  }, [id])

  const placeBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to place a bid')
      return
    }
    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= (product?.currentBid || product?.startingPrice || 0)) {
      setError(`Bid must be higher than ${product?.currentBid || product?.startingPrice}`)
      return
    }
    try {
      const newBid: Bid = {
        amount,
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        timestamp: new Date()
      }
      
      // For hardcoded products, just update the state
      if (featuredWatches.some(watch => watch.id === id)) {
        setProduct(prev => {
          if (!prev) return null
          return {
            ...prev,
            currentBid: amount,
            bids: [newBid, ...(prev.bids || [])]
          }
        })
      } else {
        // For Firestore products, update the document
        await updateDoc(doc(db, 'products', id as string), {
          currentBid: amount,
          bids: arrayUnion(newBid)
        })
        // Refresh the product data
        const updatedDoc = await getDoc(doc(db, 'products', id as string))
        setProduct({ id: updatedDoc.id, ...updatedDoc.data() } as Product)
      }
      
      setBidAmount('')
      setError('')
    } catch (error) {
      console.error('Error placing bid:', error)
      setError('Failed to place bid. Please try again.')
    }
  }

  if (error) return <div className="text-red-500 text-center py-8">{error}</div>
  if (!product) return <div className="text-gray-600 text-center py-8">Loading...</div>

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-700">
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-300">{product.brand} {product.model}</h1>
            <p className="text-xl text-blue-100">Ref: {product.reference}</p>
          </div>
          <p className="text-blue-100">{product.description}</p>
          
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-200">Starting Price:</<p className="text-blue-200">Starting Price:</p>
                <p className="text-2xl font-bold text-green-400">
                  ${product.startingPrice.toLocaleString()}
                </p>
              </div>
              {product.currentBid && (
                <div>
                  <p className="text-blue-200">Current Highest Bid:</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${product.currentBid.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <form onSubmit={placeBid} className="space-y-4">
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Enter bid amount (min. $${((product.currentBid || product.startingPrice) + 100).toLocaleString()})`}
                className="bg-gray-600 border-gray-500 text-white"
                step="100"
                min={(product.currentBid || product.startingPrice) + 100}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
              >
                {user ? 'Place Bid' : 'Login to Place Bid'}
              </Button>
            </form>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-300">Bid History</h2>
            {product.bids && product.bids.length > 0 ? (
              <ul className="space-y-2">
                {product.bids.map((bid, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                    <span className="text-blue-100">{bid.username}</span>
                    <span className="font-semibold text-green-400">${bid.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-200">No bids yet. Be the first to bid!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

