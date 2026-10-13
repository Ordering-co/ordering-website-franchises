const parseStoredUserCustomer = (raw) => {
  if (typeof raw !== 'string' || !raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

export const getCheckoutCartFetchPlan = ({
  root,
  cartId,
  hasLocalCart,
  isCustomerMode,
  customerStateUser,
  storedUserCustomerRaw
}) => {
  const storedUserCustomer = parseStoredUserCustomer(storedUserCustomerRaw)
  const userId = isCustomerMode
    ? (customerStateUser?.id ?? storedUserCustomer?.id ?? null)
    : null

  return {
    useLocalCart: Boolean(hasLocalCart && !userId),
    url: userId
      ? `${root}/carts/${cartId}?user_id=${userId}`
      : `${root}/carts/${cartId}`
  }
}
