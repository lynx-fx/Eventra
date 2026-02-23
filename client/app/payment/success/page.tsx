import React, { Suspense } from 'react'
import PaymentSuccessPage from './success'
import Loading from '@/component/loading'

export default function page() {
  return (
    <Suspense fallback={<Loading/>}>
        <PaymentSuccessPage/>
    </Suspense>
  )
}
