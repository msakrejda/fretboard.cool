import * as accidental from './accidental'
import { Accidental } from './accidental'
import { NoteLetter, NoteLetters } from './letter'

export interface PitchClass {
  letter: NoteLetter
  accidental: Accidental
}

export function pc(
  letter: NoteLetter,
  accidental: Accidental = Accidental.Natural
): PitchClass {
  return {
    letter,
    accidental,
  }
}

export function equal(pc1: PitchClass, pc2: PitchClass): boolean {
  return pc1.letter === pc2.letter && pc1.accidental === pc2.accidental
}

export function parse(pcName: string): PitchClass {
  const [letter, maybeAccidental, ...rest] = pcName.split('')
  if (rest.length !== 0) {
    throw new Error('unknown pitch class: ' + pcName)
  }
  const upcaseLetter = letter.toUpperCase()
  if (!NoteLetters.includes(upcaseLetter as NoteLetter)) {
    throw new Error('unknown note letter: ' + letter)
  }
  const accidental =
    !maybeAccidental || maybeAccidental === '♮'
      ? Accidental.Natural
      : maybeAccidental === '#' || maybeAccidental === '♯'
      ? Accidental.Sharp
      : maybeAccidental === 'b' || maybeAccidental === '♭'
      ? Accidental.Flat
      : undefined

  if (accidental === undefined) {
    throw new Error('unknown accidental: ' + maybeAccidental)
  }

  return pc(upcaseLetter as NoteLetter, accidental)
}

export function format(pc: PitchClass, ascii: boolean = false): string {
  const acc =
    pc.accidental === Accidental.Natural
      ? ''
      : accidental.format(pc.accidental, ascii)
  return `${pc.letter}${acc}`
}

export default {
  pc,
  equal,
  parse,
  format,
}
