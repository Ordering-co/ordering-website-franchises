export const shouldSkipPlaceOrder = (placing) => Boolean(placing)

const parsePaymethodData = (data) => {
  if (typeof data !== 'string') return null
  try {
    const parsed = JSON.parse(data)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

export const shouldAutoPlaceWalletPay = ({ gateway, paymethodData, methodsPay, placing }) => {
  if (shouldSkipPlaceOrder(placing)) return false
  if (!methodsPay?.includes(gateway) || typeof paymethodData !== 'string') return false
  return Boolean(parsePaymethodData(paymethodData)?.source_id)
}
