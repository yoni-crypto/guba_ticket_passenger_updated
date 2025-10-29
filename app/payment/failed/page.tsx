import dynamic from 'next/dynamic'

const PaymentFailedClient = dynamic(
  () => import('./PaymentFailedClient'),
)

export default PaymentFailedClient
