'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { name, email, message })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-blue-300">Thank You!</h2>
        <p className="text-gray-300">Your message has been received. We'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-8 bg-blue-900/30 backdrop-blur-md p-8 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-blue-300 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-cyan-300">Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-cyan-300">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-cyan-300">Message</label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 bg-blue-800/50 border-blue-600 text-cyan-100 placeholder-cyan-300/50"
            rows={4}
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-cyan-100">Send Message</Button>
      </form>
    </div>
  )
}

