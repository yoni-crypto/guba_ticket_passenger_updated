'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Search, Bus } from 'lucide-react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function NotFound() {
  const router = useRouter()

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-9xl font-bold text-blue mb-4">404</h1>
          <Bus className="size-16 text-gray-400 mx-auto mb-6" />
          
          <h2 className="text-3xl font-semibold text-black mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The page you're looking for doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue/90 transition"
            >
              <Home className="size-4" />
              Go Home
            </button>
            
            <button
              onClick={() => router.push('/search')}
              className="flex items-center gap-2 border border-blue text-blue px-6 py-3 rounded-lg font-medium hover:bg-blue hover:text-white transition"
            >
              <Search className="size-4" />
              Search Trips
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}