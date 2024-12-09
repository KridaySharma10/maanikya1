'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AddProduct() {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [reference, setReference] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to add a product')
      return
    }

    try {
      await addDoc(collection(db, 'products'), {
        brand,
        model,
        reference,
        description,
        imageUrl,
        startingPrice: parseFloat(startingPrice),
        createdAt: serverTimestamp(),
        createdBy: user.uid
      })
      router.push('/')
    } catch (error) {
      console.error('Error adding product:', error)
      setError('Failed to add product. Please try again.')
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-blue-900/30 backdrop-blur-md p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-cyan-300">Brand</label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-cyan-300">Model</label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-cyan-300">Reference</label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-cyan-300">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-cyan-300">Image URL</label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="startingPrice" className="block text-sm font-medium text-cyan-300">Starting Price</label>
          <Input
            id="startingPrice"
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-cyan-100">Add Product</Button>
      </form>
    </div>
  )
}

