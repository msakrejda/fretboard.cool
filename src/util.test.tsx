import { getNotesOnString } from './util';
import pc from './theory/pitchClass';
import note from './theory/note';
import { scale, ScaleKinds } from './theory/scale';

describe.each([
  [ 'g3', 'g', [ 0, 2, 4, 5, 7, 9, 11, 12 ]],
  [ 'a3', 'bb', [ 0, 1, 3, 5, 6, 8, 10, 12 ]]
])('getNotesOnString(%s, %s)', (string, scaleType, expectedFrets) => {
  test.only('places notes ', () => {
    const str = note.parse(string)
    const from = scale(pc.parse(scaleType), ScaleKinds.major);
    const notes = getNotesOnString(str, 12, from);
    expect(notes.length).toEqual(expectedFrets.length);
    notes.forEach((n, i) => {
      expect(n.fret).toEqual(expectedFrets[i]);
    })
  })
})
