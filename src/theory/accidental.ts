export enum Accidental {
  DoubleFlat = -2,
  Flat = -1,
  Natural = 0,
  Sharp = 1,
  DoubleSharp = 2,
}

export const Accidentals = [
  Accidental.Flat,
  Accidental.Natural,
  Accidental.Sharp,
]

const asciiMapping = {
  [Accidental.DoubleFlat]: 'bb',
  [Accidental.Flat]: 'b',
  [Accidental.Natural]: '',
  [Accidental.Sharp]: '#',
  [Accidental.DoubleSharp]: '##',
}
const unicodeMapping = {
  [Accidental.DoubleFlat]: '𝄫',
  [Accidental.Flat]: '♭',
  [Accidental.Natural]: '♮',
  [Accidental.Sharp]: '♯',
  [Accidental.DoubleSharp]: '𝄪',
}

export function format(value: Accidental, ascii: boolean = false): string {
  return (ascii ? asciiMapping : unicodeMapping)[value]
}

export function adjust(
  accidental: Accidental,
  semitones: number
): Accidental | undefined {
  const newAccidental = accidental + semitones
  return newAccidental in Accidental ? newAccidental : undefined
}

export default {
  adjust,
  format,
}
