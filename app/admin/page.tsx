'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, getDocs, doc, updateDoc, deleteDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [pendingBids, setPendingBids] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchData()
    }
  }, [user, router])

  const fetchData = async () => {
    try {
      const productsQuery = query(collection(db, 'products'))
      const productsSnapshot = await getDocs(productsQuery)
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProducts(productsData)

      const pendingBidsQuery = query(collection(db, 'bids'), where('approved', '==', false))
      const pendingBidsSnapshot = await getDocs(pendingBidsQuery)
      const pendingBidsData = pendingBidsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPendingBids(pendingBidsData)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleApproveProduct = async (productId) => {
    try {
      await updateDoc(doc(db, 'products', productId), { approved: true })
      fetchData()
    } catch (error) {
      console.error('Error approving product:', error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId))
        fetchData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleApproveBid = async (bidId) => {
    try {
      await updateDoc(doc(db, 'bids', bidId), { approved: true })
      fetchData()
    } catch (error) {
      console.error('Error approving bid:', error)
    }
  }

  const handleRejectBid = async (bidId) => {
    try {
      await deleteDoc(doc(db, 'bids', bidId))
      fetchData()
    } catch (error) {
      console.error('Error rejecting bid:', error)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-300">Admin Dashboard</h1>
      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="bids">Pending Bids</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Starting Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.model}</TableCell>
                  <TableCell>{product.reference}</TableCell>
                  <TableCell>${product.startingPrice.toLocaleString()}</TableCell>
                  <TableCell>{product.approved ? 'Approved' : 'Pending'}</TableCell>
                  <TableCell>
                    {!product.approved && (
                      <Button onClick={() => handleApproveProduct(product.id)} className="mr-2">
                        Approve
                      </Button>
                    )}
                    <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="bids">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Bidder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>{bid.productName}</TableCell>
                  <TableCell>{bid.bidderName}</TableCell>
                  <TableCell>${bid.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleApproveBid(bid.id)} className="mr-2">
                      Approve
                    </Button>
                    <Button onClick={() => handleRejectBid(bid.id)} variant="destructive">
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

