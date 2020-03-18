import pc from './pitchClass'
import note from './note'
import interval, { add, getNotesInRange, M, P } from './interval'

describe.each([
  ['c1', 'M7', 'b1'],
  ['bb3', 'M2', 'c4'],
])('add(%s, %s)', (noteStr, intervalStr, expectedStr) => {
  test('it adds correctly', () => {
    const n = note.parse(noteStr)
    const i = interval.parse(intervalStr)
    const expected = note.parse(expectedStr)
    const result = add(n, i)
    expect(result).toEqual(expected)
  })
})

describe.each([
  [
    'g3',
    12,
    {
      root: pc.parse('g'),
      intervals: [P(1), M(2), M(3), P(4), P(5), M(6), M(7)],
    },
    [0, 2, 4, 5, 7, 9, 11, 12],
  ],
  [
    'a3',
    12,
    {
      root: pc.parse('bb'),
      intervals: [P(1), M(2), M(3), P(4), P(5), M(6), M(7)],
    },
    [0, 1, 3, 5, 6, 8, 10, 12],
  ],
])('getNotesInRange(%s, %s)', (startingAt, semitones, psSeq, expectedFrets) => {
  test('places notes ', () => {
    const start = note.parse(startingAt)
    const notes = getNotesInRange(start, semitones, psSeq)
    expect(notes.length).toEqual(expectedFrets.length)
    notes.forEach((n, i) => {
      expect(note.value(n.note) - note.value(start)).toEqual(expectedFrets[i])
    })
  })
})
