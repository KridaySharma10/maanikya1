import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About WatchX</h3>
            <p className="text-sm text-gray-400">
              WatchX is a premium platform for luxury timepiece auctions, connecting watch enthusiasts and collectors worldwide.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/auctions" className="text-sm text-gray-400 hover:text-white transition-colors">Auctions</Link></li>
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">Email: info@watchx.com</p>
            <p className="text-sm text-gray-400">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">&copy; 2023 WatchX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

