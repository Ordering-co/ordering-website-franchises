import React, { useEffect } from 'react'

export const PaymentOptionEpayco = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.epayco.co/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return <></>
}
