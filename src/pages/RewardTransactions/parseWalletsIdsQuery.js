export const parseWalletsIdsQuery = (search) => {
  const raw = new URLSearchParams(search || '').get('walletsIds')
  if (typeof raw !== 'string' || !raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
