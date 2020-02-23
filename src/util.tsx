export const scaleLength = (fretCount:number, fretboardLen: number):number => {
  const lastFretPos = fretboardLen;
  const lastFretNum = fretCount;

  return lastFretPos / (1 - Math.pow(2, -lastFretNum/12));
}

export const fretPositions = (fretCount: number, scaleLength: number, fretWidth: number): number[] => {
  return Array(fretCount).fill(undefined).map((_val, i) => {
    const fretNum = i + 1;
    return scaleLength * (1 - Math.pow(2, -fretNum / 12)) - fretWidth;
  })
}

export const stringPositions = (stringCount: number, fretboardWidth: number, stringWidth: number): number[] => {
  const stringInset = 8;
  const stringPositions = Array(stringCount).fill(undefined).map((s, i) => {
    return stringInset + i * ((fretboardWidth - (2 * stringInset)) / (stringCount - 1)) - stringWidth / 2;
  })
  return stringPositions;
}
