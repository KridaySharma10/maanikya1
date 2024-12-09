'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductGrid from '@/components/ProductGrid'

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionsRef = collection(db, 'products')
        const q = query(auctionsRef, orderBy('createdAt', 'desc'), limit(12))
        const querySnapshot = await getDocs(q)
        const auctionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setAuctions(auctionsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching auctions:', error)
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-blue-300 text-center">Current Auctions</h1>
      <ProductGrid products={auctions} />
    </div>
  )
}

