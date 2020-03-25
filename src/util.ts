export const scaleLength = (
  fretCount: number,
  fretboardLen: number
): number => {
  const lastFretPos = fretboardLen
  const lastFretNum = fretCount

  return lastFretPos / (1 - Math.pow(2, -lastFretNum / 12))
}

export const fretPositions = (
  fretCount: number,
  scaleLength: number,
  fretWidth: number
): number[] => {
  return Array(fretCount)
    .fill(undefined)
    .map((_val, i) => {
      const fretNum = i + 1
      return scaleLength * (1 - Math.pow(2, -fretNum / 12)) - fretWidth
    })
}

export const stringPositions = (
  stringCount: number,
  fretboardWidth: number,
  stringWidth: number,
  stringInset: number
): number[] => {
  const stringPositions = Array(stringCount)
    .fill(undefined)
    .map((s, i) => {
      const totStringSpace = fretboardWidth - 2 * stringInset
      const spacePerString = totStringSpace / (stringCount - 1)
      return stringInset + i * spacePerString - stringWidth / 2
    })
  return stringPositions
}
