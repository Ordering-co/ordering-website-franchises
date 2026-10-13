export const safeDecodeURIComponent = (value) => {
  try {
    return decodeURIComponent(value)
  } catch (_) {
    return value
  }
}
