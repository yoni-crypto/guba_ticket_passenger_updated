'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to a default page, e.g., /my-tickets or /payment/callback
    router.replace('/my-tickets')
  }, [router])

  return null
}
