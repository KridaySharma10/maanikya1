'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProductGrid from '@/components/ProductGrid'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const featuredWatches = [
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

export default function Home() {
  const [freshArrivals, setFreshArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchProducts()
      } else {
        router.push('/login')
      }
    }
  }, [user, authLoading, router])

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'), limit(6));
      const querySnapshot = await getDocs(q);
      const freshArrivalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFreshArrivals(freshArrivalsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-300">
          Welcome to WatchX
        </h1>
        <p className="text-xl text-blue-100">
          Discover and bid on premium timepieces
        </p>
        <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
          Explore All Watches
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-blue-300 mb-6">Featured Watches</h2>
        <ProductGrid products={featuredWatches} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-blue-300 mb-6">Fresh Arrivals</h2>
        <ProductGrid products={freshArrivals} />
      </section>
    </div>
  )
}

