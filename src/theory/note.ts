import { NoteLetter } from './letter'
import * as pc from './pitchClass'
import { PitchClass } from './pitchClass'

export interface Note {
  pitchClass: PitchClass
  octave: number
}

export const note = (pitchClass: PitchClass, octave: number): Note => {
  return {
    pitchClass,
    octave,
  }
}

export const equal = (n1: Note, n2: Note): boolean => {
  return pc.equal(n1.pitchClass, n2.pitchClass) && n1.octave === n2.octave
}

export const value = (note: Note): number => {
  const val = {
    [NoteLetter.C]: 1,
    [NoteLetter.D]: 3,
    [NoteLetter.E]: 5,
    [NoteLetter.F]: 6,
    [NoteLetter.G]: 8,
    [NoteLetter.A]: 10,
    [NoteLetter.B]: 12,
  }
  return (
    val[note.pitchClass.letter] + note.pitchClass.accidental + 12 * note.octave
  )
}

export const nextAtOrBelow = (
  pitchClass: PitchClass,
  startNote: Note
): Note | undefined => {
  const maybeNext = note(pitchClass, startNote.octave)
  if (value(maybeNext) <= value(startNote)) {
    return maybeNext
  } else if (startNote.octave === 1) {
    return undefined
  } else {
    return note(pitchClass, startNote.octave - 1)
  }
}

export const parse = (noteName: string): Note => {
  const maybeNoteParts = noteName.match(/(^\D+)(\d+)/)
  if (!maybeNoteParts) {
    throw new Error('unknown note: ' + maybeNoteParts)
  }
  const [, maybePc, octaveStr] = maybeNoteParts
  const pitchClass = pc.parse(maybePc)
  const octave = parseInt(octaveStr, 10)

  return note(pitchClass, octave)
}

export const format = (note: Note, ascii: boolean = false): string => {
  return `${pc.format(note.pitchClass, ascii)}${note.octave}`
}
