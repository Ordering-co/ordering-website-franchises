import { parseJsonStorage } from './parseJsonStorage'

export const parseDriverTipOptions = (value) => {
  if (Array.isArray(value)) return value
  const parsed = parseJsonStorage(value)
  return Array.isArray(parsed) ? parsed : []
}

export const isCombinedDeliveryFeeEnabled = (value) => value === '1'
