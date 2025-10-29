'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { XCircle } from 'lucide-react'

export default function PaymentFailedClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pnr, setPnr] = useState<string | null>(null)

  useEffect(() => {
    setPnr(searchParams.get('pnr'))
  }, [searchParams])

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer pt-20 lg:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-12">
            <div className="mb-6">
              <XCircle className="size-24 text-red-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            {pnr && (
              <p className="text-lg font-semibold text-gray-700 mb-6">PNR: {pnr}</p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/my-tickets')}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
