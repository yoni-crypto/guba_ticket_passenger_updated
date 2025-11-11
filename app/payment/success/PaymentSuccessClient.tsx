'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessClient() {
  const { t } = useTranslation('pages')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pnr, setPnr] = useState<string | null>(null)

  useEffect(() => {
    setPnr(searchParams.get('pnr'))
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/my-tickets')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer pt-20 lg:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-12">
            <div className="mb-6">
              <CheckCircle className="size-24 text-green-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">{t('paymentSuccess.paymentSuccessful')}</h1>
            <p className="text-gray-600 mb-2">{t('paymentSuccess.paymentProcessed')}</p>
            {pnr && <p className="text-lg font-semibold text-blue-500 mb-6">PNR: {pnr}</p>}
            <p className="text-sm text-gray-500 mb-8">{t('paymentSuccess.redirecting')}</p>
            <button
              onClick={() => router.push('/my-tickets')}
              className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-colors"
            >
              {t('paymentSuccess.viewMyTickets')}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
