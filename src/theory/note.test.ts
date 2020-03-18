import { Accidental } from './accidental'
import { NoteLetter, NoteLetters } from './letter'

import note, { nextAtOrBelow, Note } from './note'
import pc from './pitchClass'

test('value', () => {
  const letters = NoteLetters
  const octaves = [1, 2, 3]
  let prevFlatVal: number, prevNaturalVal: number, prevSharpVal: number
  octaves.forEach((o) => {
    letters.forEach((l) => {
      const flatVal = note.value(note.note(pc.pc(l, Accidental.Flat), o))
      const naturalVal = note.value(note.note(pc.pc(l, Accidental.Natural), o))
      const sharpVal = note.value(note.note(pc.pc(l, Accidental.Sharp), o))

      expect(flatVal).toBeLessThan(naturalVal)
      expect(flatVal).toBeLessThan(sharpVal)
      expect(naturalVal).toBeLessThan(sharpVal)

      if (prevFlatVal !== undefined) {
        if (l === NoteLetter.C || l === NoteLetter.F) {
          expect(flatVal).toEqual(prevNaturalVal)
          expect(naturalVal).toEqual(prevSharpVal)
        } else {
          expect(flatVal).toEqual(prevSharpVal)
        }
      }

      prevFlatVal = flatVal
      prevNaturalVal = naturalVal
      prevSharpVal = sharpVal
    })
  })
})

test('parse', () => {
  const n = note.parse('c1')
  expect(n.octave).toEqual(1)
  expect(n.pitchClass.letter).toEqual(NoteLetter.C)
  expect(n.pitchClass.accidental).toEqual(Accidental.Natural)
})

describe.each([['bb', 'a3', 'bb2']])(
  'nextAtOrBelow(%s, %s)',
  (pitchClassStr, relativeToStr, expectedStr) => {
    test('finds the correct note', () => {
      const pitchClass = pc.parse(pitchClassStr)
      const relativeTo = note.parse(relativeToStr)
      const expected = note.parse(expectedStr)
      const result = nextAtOrBelow(pitchClass, relativeTo)
      expect(result).toBeDefined()
      expect(note.equal(result as Note, expected))
    })
  }
)
