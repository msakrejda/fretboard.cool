import { getNotesOnString } from './util';
import { parseNote, parsePitchClass, scale, ScaleKinds } from './theory';

describe.each([
  [ 'g3', 'g', [ 0, 2, 4, 5, 7, 9, 11, 12 ]],
  [ 'a3', 'bb', [ 0, 1, 3, 5, 6, 8, 10, 12 ]]
])('getNotesOnString(%s, %s)', (string, pc, expectedFrets) => {
  test.only('places notes ', () => {
    const str = parseNote(string)
    const from = scale(parsePitchClass(pc), ScaleKinds.major);
    const notes = getNotesOnString(str, 12, from);
    expect(notes.length).toEqual(expectedFrets.length);
    notes.forEach((n, i) => {
      expect(n.fret).toEqual(expectedFrets[i]);
    })
  })
})
