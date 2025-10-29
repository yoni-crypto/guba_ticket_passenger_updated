import dynamic from 'next/dynamic'

const PaymentSuccessClient = dynamic(
  () => import('./PaymentSuccessClient'),
  // { ssr: false } 
)

export default PaymentSuccessClient
