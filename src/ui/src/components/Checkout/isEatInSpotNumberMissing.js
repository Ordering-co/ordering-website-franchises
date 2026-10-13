export const isEatInSpotNumberMissing = ({
  tableNumberEnabled,
  orderType,
  cartSpotNumber,
  cartStateSpotNumber
}) => (
  tableNumberEnabled === '1' &&
  orderType === 3 &&
  !(cartStateSpotNumber || cartSpotNumber)
)
