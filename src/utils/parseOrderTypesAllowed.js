export const parseOrderTypesAllowed = (value) => {
  if (typeof value !== 'string' || value === '') return []
  return value.split('|').map(item => Number(item))
}
