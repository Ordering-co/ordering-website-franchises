export const clearUserCustomerOnLogout = (deleteUserCustomer) => {
  deleteUserCustomer?.(true)
}
